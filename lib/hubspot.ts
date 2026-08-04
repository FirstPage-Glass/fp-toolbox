import { pool } from "./db";

export interface HubSpotLead {
  id: string;
  name: string;
  email: string;
  website: string | null;
  createdAt: string;
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

function isValidWebsite(url: string | null): boolean {
  if (!url) return false;
  // Reject raw email addresses pasted as website before URL parsing ("http://x@gmail.com")
  if (url.includes("@")) return false;
  const host = getHost(url);
  if (!host) return false;
  if (SOCIAL_HOSTS.has(host) || PLATFORM_HOSTS.has(host)) return false;
  // Reject pure-numeric hosts (phone numbers, "1234", "67696969")
  if (/^\d+$/.test(host.replace(/\./g, ""))) return false;
  return host.includes(".");
}

/**
 * The strongest spam signal: when the email domain is a corporate domain,
 * the website must be on that same domain. Free email (gmail etc.) is allowed,
 * but the website must still be a real domain.
 */
function domainMatches(emailDomain: string, websiteHost: string): boolean {
  // Same exact domain, or website is a subdomain of the email domain
  if (websiteHost === emailDomain || websiteHost.endsWith("." + emailDomain)) return true;
  return false;
}

export function isSpam(email: string, website: string | null): boolean {
  if (!isValidEmail(email)) return true;
  const emailDomain = email.split("@")[1]?.toLowerCase() ?? "";
  if (DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) return true;
  if (!isValidWebsite(website)) return true;

  const websiteHost = getHost(website!)!;
  // ponytail: leads that enter FirstPage's own site are test entries / spam
  if (websiteHost.includes("firstpage")) return true;
  // Only show leads whose email domain matches their website domain —
  // a corporate email on the same domain is the strongest real-lead signal.
  if (!domainMatches(emailDomain, websiteHost)) return true;
  return false;
}

/** Recent contacts (default last 7 days) from HubSpot, spam-filtered + deduped by email. */
export async function fetchRecentLeads(days = 7): Promise<HubSpotLead[]> {
  const token = process.env.HUBSPOT_SERVICE_KEY;
  if (!token) {
    throw new Error("HUBSPOT_SERVICE_KEY not configured");
  }
  const then = Date.now() - days * 24 * 3600 * 1000;

  // ponytail: HubSpot search caps at 100/page — paginate via `after` cursor.
  // MAX_PAGES hard-caps the scan (1000 contacts); the 7-day window is normally ~150.
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
      const cached = await pool.query(
        `SELECT id, name, email, website, created_at AS "createdAt"
         FROM hubspot_leads_cache ORDER BY created_at DESC`
      );
      return cached.rows as HubSpotLead[];
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
