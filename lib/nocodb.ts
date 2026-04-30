export interface NocoDBShowcase {
  Id: number;
  title?: string | null;
  Title?: string | null;
  image?: NocoDBAttachment[] | null;
  Image?: NocoDBAttachment[] | null;
  description?: string | null;
  Description?: string | null;
  tool_id?: number | null;
  Tool?: { id: number; [key: string]: unknown } | null; // Link record as object
  display_order?: number | null;
  "Display Order"?: number | null;
  created_at?: string;
  CreatedAt?: string;
}

export interface NocoDBAttachment {
  path: string;
  title: string;
  mimetype: string;
  size: number;
  signedPath?: string;
  thumbnails?: {
    tiny?: { signedPath: string };
    small?: { signedPath: string };
    card_cover?: { signedPath: string };
  };
}

export interface NocoDBTool {
  Id: number;
  CreatedAt: string;
  UpdatedAt: string;
  name: string;
  description: string;
  category: string;
  status: string;
  tech_stack: string;
  repository_path: string | null;
  documentation_url: string | null;
  live_link: string | null;
  gh_link: string | null;
  slug: string | null;
  owner: string | null;
  last_updated: string | null;
  priority: string | null;
  cover_image?: NocoDBAttachment[] | null;
  type?: string[] | null;
  // Rich detail fields
  tagline?: string | null;
  before?: string | null;
  after?: string | null;
  flow?: string | null;
  impact?: string | null;
  hours_saved_per_month?: number | null;
  cost_saved_per_month?: number | null;
  volume_per_month?: string | null;
  uptime?: string | null;
  since?: string | null;
  ai_models?: string | null;
  serve?: string[] | null;
}

export interface NocoDBRecord {
  id: number;
  id_fields: { Id: number };
  fields: Omit<NocoDBTool, "Id">;
}

const NOCODB_URL =
  process.env.NOCODB_URL ||
  process.env.NEXT_PUBLIC_NOCODB_URL ||
  "https://nocodb.firstpage.com.hk";
const NOCODB_API_TOKEN =
  process.env.NOCODB_API_TOKEN ||
  process.env.NEXT_PUBLIC_NOCODB_API_TOKEN ||
  "";
const NOCODB_TOOLS_BASE_ID =
  process.env.NOCODB_TOOLS_BASE_ID ||
  process.env.NEXT_PUBLIC_NOCODB_TOOLS_BASE_ID ||
  "p9ri10dzcq5d71l";
const NOCODB_TOOLS_TABLE_ID =
  process.env.NOCODB_TOOLS_TABLE_ID ||
  process.env.NEXT_PUBLIC_NOCODB_TOOLS_TABLE_ID ||
  "m84ca9736466jfm";

export async function fetchAllTools(): Promise<NocoDBTool[]> {
  try {
    const url = `${NOCODB_URL}/api/v3/data/${NOCODB_TOOLS_BASE_ID}/${NOCODB_TOOLS_TABLE_ID}/records?pageSize=100`;
    const response = await fetch(url, {
      headers: {
        "xc-token": NOCODB_API_TOKEN,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`NocoDB API error: ${response.status}`);
    }

    const data = await response.json();
    return data.records.map((record: NocoDBRecord) => ({
      Id: record.id,
      ...record.fields,
    }));
  } catch (error) {
    console.error("Failed to fetch tools from NocoDB:", error);
    return [];
  }
}

export async function fetchToolById(id: number): Promise<NocoDBTool | null> {
  try {
    const url = `${NOCODB_URL}/api/v3/data/${NOCODB_TOOLS_BASE_ID}/${NOCODB_TOOLS_TABLE_ID}/records/${id}`;
    const response = await fetch(url, {
      headers: {
        "xc-token": NOCODB_API_TOKEN,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`NocoDB API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      Id: data.id,
      ...data.fields,
    };
  } catch (error) {
    console.error("Failed to fetch tool from NocoDB:", error);
    return null;
  }
}

export async function fetchToolBySlug(slug: string): Promise<NocoDBTool | null> {
  try {
    const url = `${NOCODB_URL}/api/v3/data/${NOCODB_TOOLS_BASE_ID}/${NOCODB_TOOLS_TABLE_ID}/records?pageSize=1&where=(slug,eq,${encodeURIComponent(slug)})`;
    const response = await fetch(url, {
      headers: {
        "xc-token": NOCODB_API_TOKEN,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`NocoDB API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.records || data.records.length === 0) return null;

    const record = data.records[0];
    return {
      Id: record.id_fields?.Id ?? record.id,
      ...record.fields,
    };
  } catch (error) {
    console.error("Failed to fetch tool by slug from NocoDB:", error);
    return null;
  }
}

const HOURLY_RATE = Number(process.env.NEXT_PUBLIC_HOURLY_RATE || process.env.HOURLY_RATE || "1000");

/** Calculate cost saved from hours at configured hourly rate (default HKD$1000/hr) */
export function calculateCostSaved(hours?: number | null): number {
  if (!hours || hours <= 0) return 0;
  return hours * HOURLY_RATE;
}

/** Get a displayable image URL from a NocoDB attachment. Prefers card_cover thumbnail, falls back to full signed URL. */
export function getCoverImageUrl(attachment?: NocoDBAttachment | null): string | null {
  if (!attachment) return null;
  if (attachment.thumbnails?.card_cover?.signedPath) {
    return `${NOCODB_URL}/${attachment.thumbnails.card_cover.signedPath}`;
  }
  if (attachment.signedPath) {
    return `${NOCODB_URL}/${attachment.signedPath}`;
  }
  return null;
}

/** Get full-resolution image URL from a NocoDB attachment (no thumbnail). */
export function getFullImageUrl(attachment?: NocoDBAttachment | null): string | null {
  if (!attachment) return null;
  if (attachment.signedPath) {
    return `${NOCODB_URL}/${attachment.signedPath}`;
  }
  return null;
}

// Showcase table config
const NOCODB_SHOWCASES_TABLE_ID = process.env.NOCODB_SHOWCASES_TABLE_ID || process.env.NEXT_PUBLIC_NOCODB_SHOWCASES_TABLE_ID || "";

/** Fetch showcases for a specific tool by tool_id or Link record */
export async function fetchShowcasesByToolId(toolId: number): Promise<NocoDBShowcase[]> {
  if (!NOCODB_SHOWCASES_TABLE_ID) {
    console.warn("NOCODB_SHOWCASES_TABLE_ID not configured, skipping showcase fetch");
    return [];
  }
  
  try {
    // NocoDB Link fields don't support nested filtering (Tool.id,eq,X)
    // So we fetch all showcases and filter client-side
    const url = `${NOCODB_URL}/api/v3/data/${NOCODB_TOOLS_BASE_ID}/${NOCODB_SHOWCASES_TABLE_ID}/records?pageSize=100`;
    const response = await fetch(url, {
      headers: {
        "xc-token": NOCODB_API_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch showcases: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const showcases = normalizeShowcases(data.records || []);
    
    // Filter by tool_id (Number field) or Tool (Link record)
    return showcases.filter((s: NocoDBShowcase) => {
      // Check tool_id Number field
      if (s.tool_id === toolId) return true;
      // Check Tool Link record (object with id)
      if (s.Tool?.id === toolId) return true;
      // Check Tool as array (if multiple links supported in future)
      if (Array.isArray(s.Tool) && s.Tool.some((t) => t.id === toolId)) return true;
      return false;
    });
  } catch (error) {
    console.error("Failed to fetch showcases from NocoDB:", error);
    return [];
  }
}

/** Normalize showcase record fields from NocoDB */
function normalizeShowcases(records: Record<string, unknown>[]): NocoDBShowcase[] {
  return records.map((record) => {
    const fields = (record.fields || {}) as Record<string, unknown>;
    return {
      Id: (record.id || fields.Id) as number,
      title: (fields.title || fields.Title) as string | undefined,
      Title: fields.Title as string | undefined,
      image: (fields.image || fields.Image) as NocoDBAttachment[] | undefined,
      Image: fields.Image as NocoDBAttachment[] | undefined,
      description: (fields.description || fields.Description) as string | undefined,
      Description: fields.Description as string | undefined,
      tool_id: fields.tool_id as number | undefined,
      Tool: fields.Tool as NocoDBShowcase["Tool"],
      display_order: (fields.display_order || fields["Display Order"]) as number | undefined,
      "Display Order": fields["Display Order"] as number | undefined,
      created_at: (fields.created_at || fields.CreatedAt) as string | undefined,
      CreatedAt: fields.CreatedAt as string | undefined,
    };
  }).sort((a: NocoDBShowcase, b: NocoDBShowcase) => {
    const orderA = a.display_order || a["Display Order"] || 0;
    const orderB = b.display_order || b["Display Order"] || 0;
    return orderA - orderB;
  });
}

/** Get showcase image URL from NocoDB attachment (full resolution) */
export function getShowcaseImageUrl(showcase?: NocoDBShowcase | null): string | null {
  const images = showcase?.image || showcase?.Image;
  if (!images || images.length === 0) return null;
  return getFullImageUrl(images[0]);
}

/** Get showcase title with fallback */
export function getShowcaseTitle(showcase?: NocoDBShowcase | null): string {
  return showcase?.title || showcase?.Title || "Showcase";
}

/** Get showcase description with fallback */
export function getShowcaseDescription(showcase?: NocoDBShowcase | null): string | null {
  return showcase?.description || showcase?.Description || null;
}
