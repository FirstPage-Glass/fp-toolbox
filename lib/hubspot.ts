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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidWebsite(url: string | null): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    if (SOCIAL_HOSTS.has(host)) return false;
    return host.includes(".");
  } catch {
    return false;
  }
}

function isSpam(email: string, website: string | null): boolean {
  if (!isValidEmail(email)) return true;
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) return true;
  // ponytail: require a real website — drops social-profile-only and blank entries
  if (!isValidWebsite(website)) return true;
  return false;
}

/** Recent contacts (default last 3 days) from HubSpot, spam-filtered + deduped by email. */
export async function fetchRecentLeads(days = 3): Promise<HubSpotLead[]> {
  const token = process.env.HUBSPOT_SERVICE_KEY;
  if (!token) {
    throw new Error("HUBSPOT_SERVICE_KEY not configured");
  }
  const then = Date.now() - days * 24 * 3600 * 1000;
  const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      limit: 100,
      filterGroups: [
        { filters: [{ propertyName: "createdate", operator: "GTE", value: String(then) }] },
      ],
      properties: ["firstname", "lastname", "email", "website", "createdate"],
      sort: [{ propertyName: "createdate", direction: "DESCENDING" }],
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    throw new Error(`HubSpot error ${res.status}`);
  }
  const data = await res.json();
  const seen = new Set<string>();
  const leads: HubSpotLead[] = [];
  for (const r of data.results ?? []) {
    const p = r.properties ?? {};
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
      createdAt: r.createdAt ?? "",
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
export async function getRecentLeads(days = 3): Promise<HubSpotLead[]> {
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
