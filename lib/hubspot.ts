import { pool } from "./db";
import { resolveMx } from "node:dns/promises";

export interface HubSpotLead {
  id: string;
  name: string;
  email: string;
  website: string | null;
  createdAt: string;
}

export interface LeadScore {
  score: number;
  label: "hot" | "warm" | "cold";
  reasons: string[];
}

// ponytail: static disposable-domain list — good enough for MVP, swap for a live blocklist API if spam persists.
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com", "yopmail.com", "guerrillamail.com", "guerrillamail.net",
  "10minutemail.com", "tempmail.com", "throwaway.email", "getnada.com",
  "maildrop.cc", "trashmail.com", "spam4.me", "temp-mail.org", "dispostable.com",
]);

const SOCIAL_HOSTS = new Set([
  "facebook.com", "fb.com", "instagram.com", "twitter.com", "x.com",
  "linkedin.com", "youtube.com", "tiktok.com", "whatsapp.com", "wa.me",
  "t.me", "pinterest.com", "snapchat.com", "reddit.com", "wechat.com",
]);

/** Domains that are platforms / utilities, never a real client website. */
const PLATFORM_HOSTS = new Set([
  "google.com", "google.co.uk", "google.com.hk", "apple.com", "microsoft.com",
  "amazon.com", "ebay.com", "etsy.com", "alibaba.com", "taobao.com",
  "jd.com", "shopify.com", "myshopify.com", "squarespace.com", "wix.com",
  "wordpress.com", "blogspot.com", "medium.com", "tumblr.com",
]);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/** Extract the host (lowercase, no www) from a URL string, or null if invalid. */
function getHost(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

function domainMatches(emailDomain: string, websiteHost: string): boolean {
  // Same exact domain, or website is a subdomain of the email domain
  if (websiteHost === emailDomain || websiteHost.endsWith("." + emailDomain)) return true;
  return false;
}

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.com.hk", "hotmail.com",
  "outlook.com", "live.com", "icloud.com", "qq.com", "163.com", "126.com",
  "foxmail.com", "msn.com", "aol.com", "proton.me", "protonmail.com",
]);

/** Generic mailbox prefixes — hard to reach a decision-maker through these. */
const GENERIC_MAILBOXES = new Set([
  "info", "sales", "admin", "hello", "contact", "marketing", "enquiry",
  "enquiries", "support", "office", "service", "hr", "account", "billing",
  "careers", "noreply", "no-reply", "mail", "post", "webmaster",
]);

/** ponytail: MX lookups are cached per domain, 24h TTL — DNS is stable, no per-lead cost. */
const mxCache = new Map<string, { ok: boolean; at: number }>();
async function checkMx(domain: string): Promise<boolean> {
  const hit = mxCache.get(domain);
  if (hit && Date.now() - hit.at < 24 * 3600 * 1000) return hit.ok;
  let ok = false;
  try {
    ok = (await resolveMx(domain)).length > 0;
  } catch {
    ok = false;
  }
  mxCache.set(domain, { ok, at: Date.now() });
  return ok;
}

/**
 * Classify a contact as spam or good, with the reason. Mirrors the old isSpam
 * logic but returns the category so the spam report can aggregate it.
 */
export function classify(email: string, website: string | null): { spam: boolean; reason: string } {
  if (!isValidEmail(email)) return { spam: true, reason: "bad_email" };
  const emailDomain = email.split("@")[1]?.toLowerCase() ?? "";
  if (DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) return { spam: true, reason: "disposable" };
  if (!website) return { spam: true, reason: "no_website" };
  // Reject raw email addresses pasted as website before URL parsing ("http://x@gmail.com")
  if (website.includes("@")) return { spam: true, reason: "email_as_website" };
  const host = getHost(website);
  if (!host) return { spam: true, reason: "bad_url" };
  if (SOCIAL_HOSTS.has(host)) return { spam: true, reason: "social" };
  if (PLATFORM_HOSTS.has(host)) return { spam: true, reason: "platform" };
  // Reject pure-numeric hosts (phone numbers, "1234", "67696969")
  if (/^\d+$/.test(host.replace(/\./g, ""))) return { spam: true, reason: "numeric_host" };
  if (host.includes("firstpage")) return { spam: true, reason: "firstpage" };
  // Strongest signal: corporate email must sit on the same domain as the website
  if (!domainMatches(emailDomain, host)) return { spam: true, reason: "domain_mismatch" };
  return { spam: false, reason: "good" };
}

export function isSpam(email: string, website: string | null): boolean {
  return classify(email, website).spam;
}

/**
 * Score a lead 0-100 for triage: email reputation (MX + free/generic mailbox)
 * plus website completeness. PSI is deliberately NOT here — it's slow and
 * belongs in the Meeting Prep pipeline once a lead is picked.
 */
export async function scoreLead(email: string, website: string | null): Promise<LeadScore> {
  const reasons: string[] = [];
  let score = 50;
  const emailDomain = email.split("@")[1]?.toLowerCase() ?? "";
  const mailbox = email.split("@")[0]?.toLowerCase() ?? "";

  if (FREE_EMAIL_DOMAINS.has(emailDomain)) {
    score -= 15;
    reasons.push("free email domain");
  } else {
    score += 10;
    reasons.push("corporate domain");
  }
  if (GENERIC_MAILBOXES.has(mailbox)) {
    score -= 15;
    reasons.push("generic mailbox (info@/sales@)");
  } else {
    score += 10;
    reasons.push("named mailbox");
  }
  if (website && /^https:\/\//i.test(website.trim())) {
    score += 10;
    reasons.push("https website");
  } else if (website) {
    score += 2;
  } else {
    score -= 20;
    reasons.push("no website");
  }
  if (await checkMx(emailDomain)) {
    score += 10;
    reasons.push("valid mail server");
  } else {
    score -= 25;
    reasons.push("no MX record");
  }

  score = Math.max(0, Math.min(100, score));
  const label = score >= 75 ? "hot" : score >= 50 ? "warm" : "cold";
  return { score, label, reasons };
}

/** Recent contacts (default last 7 days) from HubSpot, spam-filtered + deduped by email. */
export async function fetchRecentLeads(days = 7, sinceDaysAgo?: number): Promise<HubSpotLead[]> {
  const token = process.env.HUBSPOT_SERVICE_KEY;
  if (!token) {
    throw new Error("HUBSPOT_SERVICE_KEY not configured");
  }
  const now = Date.now();
  const then = now - days * 24 * 3600 * 1000;
  // Optional upper bound: createdate in [now-days, now-sinceDaysAgo] — lets the
  // dashboard fetch the *previous* window as its own window (leads are deduped
  // by email, so "double window minus window" would understate it).
  const filters: Record<string, unknown>[] = [
    { propertyName: "createdate", operator: "GTE", value: String(then) },
  ];
  if (sinceDaysAgo !== undefined) {
    filters.push({
      propertyName: "createdate",
      operator: "LT",
      value: String(now - sinceDaysAgo * 24 * 3600 * 1000),
    });
  }

  // ponytail: HubSpot search caps at 100/page — paginate via `after` cursor.
  // MAX_PAGES hard-caps the scan (1000 contacts); the 7-day window is normally ~150.
  const PAGE_LIMIT = 100;
  const MAX_PAGES = 10;
  const all: Record<string, unknown>[] = [];
  let after: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const body: Record<string, unknown> = {
      limit: PAGE_LIMIT,
      filterGroups: [{ filters }],
      properties: ["firstname", "lastname", "email", "website", "createdate"],
      sort: [{ propertyName: "createdate", direction: "DESCENDING" }],
    };
    if (after) body.after = after;
    const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) {
      throw new Error(`HubSpot error ${res.status}`);
    }
    const data = await res.json();
    all.push(...(data.results ?? []));
    after = data.paging?.next?.after;
    if (!after) break;
  }

  const seen = new Set<string>();
  const leads: HubSpotLead[] = [];
  for (const r of all) {
    const p = (r.properties ?? {}) as Record<string, unknown>;
    const email = String(p.email ?? "").trim().toLowerCase();
    const website = p.website ? String(p.website).trim() : null;
    if (isSpam(email, website)) continue;
    if (seen.has(email)) continue;
    seen.add(email);
    leads.push({
      id: String(r.id),
      name: `${p.firstname ?? ""} ${p.lastname ?? ""}`.trim(),
      email,
      website,
      createdAt: String(r.createdAt ?? ""),
    });
  }
  return leads;
}

const CACHE_TTL_MINUTES = 60;

async function ensureCacheTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hubspot_leads_cache (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL,
      website TEXT,
      created_at TEXT NOT NULL DEFAULT '',
      fetched_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

/**
 * Recent leads with a Postgres cache — same data for the whole team,
 * one HubSpot fetch per hour instead of one per picker click.
 */
export async function getRecentLeads(days = 7): Promise<HubSpotLead[]> {
  try {
    await ensureCacheTable();
    // Fresh enough? Serve from cache.
    const fresh = await pool.query(
      `SELECT 1 FROM hubspot_leads_cache
       WHERE fetched_at > now() - make_interval(mins => $1) LIMIT 1`,
      [CACHE_TTL_MINUTES]
    );
    if ((fresh.rowCount ?? 0) > 0) {
      // Cache stores whatever the last fetch window pulled — filter by the
      // requested days so `getRecentLeads(7)` doesn't return 30-day data.
      const cutoff = new Date(Date.now() - days * 24 * 3600 * 1000).toISOString();
      const cached = await pool.query(
        `SELECT id, name, email, website, created_at AS "createdAt"
         FROM hubspot_leads_cache ORDER BY created_at DESC`
      );
      return (cached.rows as HubSpotLead[]).filter((r) => r.createdAt >= cutoff);
    }
  } catch (err) {
    // ponytail: DB down -> fall back to direct fetch, don't break the picker
    console.error("hubspot cache read failed:", err);
    return fetchRecentLeads(days);
  }

  const leads = await fetchRecentLeads(days);
  try {
    await ensureCacheTable();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("DELETE FROM hubspot_leads_cache");
      for (const l of leads) {
        await client.query(
          `INSERT INTO hubspot_leads_cache (id, name, email, website, created_at)
           VALUES ($1, $2, $3, $4, $5)`,
          [l.id, l.name, l.email, l.website, l.createdAt]
        );
      }
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("hubspot cache write failed:", err);
  }
  return leads;
}

export interface SpamCategory {
  reason: string;
  count: number;
}

export interface SpamSource {
  domain: string;
  count: number;
}

export interface SpamReport {
  total: number;
  good: number;
  spam: number;
  spamRatePct: number;
  categories: SpamCategory[];
  topSources: SpamSource[];
}

const REASON_LABELS: Record<string, string> = {
  bad_email: "Malformed email",
  disposable: "Disposable email",
  no_website: "No website",
  email_as_website: "Email pasted as website",
  bad_url: "Unparseable URL",
  social: "Social site as website",
  platform: "Platform/build-it-yourself site",
  numeric_host: "Numeric host (phone no.)",
  firstpage: "FirstPage's own site",
  domain_mismatch: "Email domain ≠ website domain",
};

export { REASON_LABELS };

/**
 * Spam report for the admin page: pulls the last N days of contacts,
 * classifies each one, and aggregates reason + worst-source domains.
 * No cache — the admin page is low-traffic and wants fresh numbers.
 */
export async function getSpamReport(days = 30): Promise<SpamReport> {
  const token = process.env.HUBSPOT_SERVICE_KEY;
  if (!token) throw new Error("HUBSPOT_SERVICE_KEY not configured");
  const then = Date.now() - days * 24 * 3600 * 1000;

  const PAGE_LIMIT = 100;
  const MAX_PAGES = 10;
  const all: Record<string, unknown>[] = [];
  let after: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const body: Record<string, unknown> = {
      limit: PAGE_LIMIT,
      filterGroups: [
        { filters: [{ propertyName: "createdate", operator: "GTE", value: String(then) }] },
      ],
      properties: ["firstname", "lastname", "email", "website", "createdate"],
      sort: [{ propertyName: "createdate", direction: "DESCENDING" }],
    };
    if (after) body.after = after;
    const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new Error(`HubSpot error ${res.status}`);
    const data = await res.json();
    all.push(...(data.results ?? []));
    after = data.paging?.next?.after;
    if (!after) break;
  }

  const byReason = new Map<string, number>();
  const bySource = new Map<string, number>();
  let good = 0;
  for (const r of all) {
    const p = (r.properties ?? {}) as Record<string, unknown>;
    const email = String(p.email ?? "").trim().toLowerCase();
    const website = p.website ? String(p.website).trim() : null;
    const { spam, reason } = classify(email, website);
    if (!spam) {
      good++;
      continue;
    }
    byReason.set(reason, (byReason.get(reason) ?? 0) + 1);
    // Worst-source domain: prefer the email domain (that's what we'd block),
    // fall back to the website host.
    const domain = email.split("@")[1]?.toLowerCase() ?? getHost(website ?? "") ?? "unknown";
    bySource.set(domain, (bySource.get(domain) ?? 0) + 1);
  }

  const total = all.length;
  const spam = total - good;
  const categories = [...byReason.entries()]
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count);
  const topSources = [...bySource.entries()]
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  return {
    total,
    good,
    spam,
    spamRatePct: total ? Math.round((spam / total) * 100) : 0,
    categories: categories.map((c) => ({
      ...c,
      reason: REASON_LABELS[c.reason] ?? c.reason,
    })),
    topSources,
  };
}
