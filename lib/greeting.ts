import nodemailer from "nodemailer";
import { pool } from "./db";
import { greetingRecipients } from "./hubspot";
import type { GreetingRecipient } from "./hubspot";
import { buildGreetingEmail } from "./greeting-template";

export interface GreetingStats {
  sent: number;
  skippedNoOwner: number;
  failed: number;
}

export async function ensureGreetingTables(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS greeting_sent (
      contact_id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      owner_id TEXT,
      owner_name TEXT NOT NULL DEFAULT '',
      owner_email TEXT NOT NULL DEFAULT '',
      subject TEXT NOT NULL DEFAULT '',
      sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      error TEXT
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS greeting_meta (
      meta_key TEXT PRIMARY KEY,
      meta_value TEXT NOT NULL
    )
  `);
}

async function upsertGreeting(row: {
  contactId: string;
  email: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  subject: string;
  error: string | null;
}): Promise<void> {
  await pool.query(
    `INSERT INTO greeting_sent (contact_id, email, owner_id, owner_name, owner_email, subject, sent_at, error)
     VALUES ($1,$2,$3,$4,$5,$6, now(), $7)
     ON CONFLICT (contact_id) DO UPDATE SET
       owner_id = EXCLUDED.owner_id,
       owner_name = EXCLUDED.owner_name,
       owner_email = EXCLUDED.owner_email,
       subject = EXCLUDED.subject,
       sent_at = now(),
       error = EXCLUDED.error`,
    [row.contactId, row.email, row.ownerId, row.ownerName, row.ownerEmail, row.subject, row.error]
  );
}

type SendItem = { recipient: GreetingRecipient; owner: { fullName: string; email: string } };

async function fetchOwners(): Promise<Map<string, { fullName: string; email: string }>> {
  const token = process.env.HUBSPOT_SERVICE_KEY;
  if (!token) throw new Error("HUBSPOT_SERVICE_KEY not configured");
  const res = await fetch("https://api.hubapi.com/crm/v3/owners?limit=200", {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`HubSpot owners error ${res.status}`);
  const data = (await res.json()) as { results?: Record<string, unknown>[] };
  const owners = new Map<string, { fullName: string; email: string }>();
  for (const o of data.results ?? []) {
    const email = String(o.email ?? "");
    const fullName = `${o.firstName ?? ""} ${o.lastName ?? ""}`.trim();
    owners.set(String(o.id), { fullName: fullName || email, email });
  }
  return owners;
}

function greet(item: SendItem): { subject: string; text: string } {
  return buildGreetingEmail({
    ownerName: item.owner.fullName,
    company: item.recipient.company,
    lastName: item.recipient.lastName,
    firstName: item.recipient.firstName,
  });
}

async function printDryRun(item: SendItem): Promise<void> {
  console.log(
    `[greeting] dry-run would send to ${item.recipient.email} as ${item.owner.fullName} subject "${greet(item).subject}"`
  );
}

export interface GreetingStatsView {
  /** Successfully sent, all time. */
  totalSent: number;
  /** Successfully sent in the last N days. */
  sentDays: number;
  /** Errored rows = pending retry. */
  retrying: number;
  /** Configured for live send (not dry-run). */
  live: boolean;
}

/** KPI view for the admin page — counts from greeting_sent, never throws. */
export async function getGreetingStats(days = 30): Promise<GreetingStatsView> {
  const live = !(process.env.GREETING_DRY_RUN === "1") && Boolean(process.env.SMTP_USER);
  try {
    await ensureGreetingTables();
    const [{ rows: total }, { rows: windowed }, { rows: retry }] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS n FROM greeting_sent WHERE error IS NULL`),
      pool.query(
        `SELECT COUNT(*)::int AS n FROM greeting_sent
         WHERE error IS NULL AND sent_at > now() - make_interval(days => ${Math.max(1, Math.floor(days))})`
      ),
      pool.query(`SELECT COUNT(*)::int AS n FROM greeting_sent WHERE error IS NOT NULL`),
    ]);
    return {
      totalSent: total[0].n ?? 0,
      sentDays: windowed[0].n ?? 0,
      retrying: retry[0].n ?? 0,
      live,
    };
  } catch (err) {
    console.error("getGreetingStats failed:", err);
    return { totalSent: 0, sentDays: 0, retrying: 0, live };
  }
}

export async function sendGreetings(): Promise<GreetingStats> {
  const stats: GreetingStats = { sent: 0, skippedNoOwner: 0, failed: 0 };
  try {
    await ensureGreetingTables();

    // Cold-start cutover: date the job first started; never blast the backlog.
    const { rows: startedRows } = await pool.query(
      `SELECT meta_value FROM greeting_meta WHERE meta_key = 'started_at'`
    );
    let startedAt: string;
    if (startedRows.length > 0) {
      startedAt = String(startedRows[0].meta_value);
    } else {
      startedAt = new Date().toISOString();
      await pool.query(
        `INSERT INTO greeting_meta (meta_key, meta_value) VALUES ('started_at', $1)`,
        [startedAt]
      );
    }

    const { rows: sentRows } = await pool.query(
      `SELECT contact_id FROM greeting_sent WHERE error IS NULL`
    );
    const alreadySent = new Set(sentRows.map((r) => String(r.contact_id)));

    const owners = await fetchOwners();

    const toSend: SendItem[] = [];
    for (const r of await greetingRecipients(7)) {
      if (!(Date.parse(r.createdAt) >= Date.parse(startedAt))) continue;
      if (alreadySent.has(r.contactId)) continue;
      if (!r.ownerId) {
        stats.skippedNoOwner++;
        continue;
      }
      const owner = owners.get(r.ownerId);
      if (!owner) {
        stats.skippedNoOwner++;
        continue;
      }
      toSend.push({ recipient: r, owner });
    }

    const dryRun = process.env.GREETING_DRY_RUN === "1" || !process.env.SMTP_USER;
    if (dryRun) {
      for (const item of toSend) {
        await printDryRun(item);
        stats.sent++;
      }
      return stats;
    }

    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
    try {
      await transport.verify();
    } catch (err) {
      console.log(
        `[greeting] SMTP verify failed (${err instanceof Error ? err.message : String(err)}) — dry-run, no rows written`
      );
      for (const item of toSend) {
        await printDryRun(item);
        stats.sent++;
      }
      return stats;
    }

    for (const item of toSend) {
      try {
        const { subject, text } = greet(item);
        await transport.sendMail({
          from: { name: item.owner.fullName, address: process.env.SMTP_USER! },
          to: item.recipient.email,
          replyTo: item.owner.email,
          subject,
          text,
        });
        await upsertGreeting({
          contactId: item.recipient.contactId,
          email: item.recipient.email,
          ownerId: item.recipient.ownerId!,
          ownerName: item.owner.fullName,
          ownerEmail: item.owner.email,
          subject,
          error: null,
        });
        stats.sent++;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        await upsertGreeting({
          contactId: item.recipient.contactId,
          email: item.recipient.email,
          ownerId: item.recipient.ownerId!,
          ownerName: item.owner.fullName,
          ownerEmail: item.owner.email,
          subject: "",
          error: message,
        }).catch((dbErr) => console.error("[greeting] failed to record error:", dbErr));
        stats.failed++;
        console.error(`[greeting] send failed for ${item.recipient.email}:`, message);
      }
    }

    return stats;
  } catch (err) {
    console.error("sendGreetings failed:", err);
    return stats;
  }
}