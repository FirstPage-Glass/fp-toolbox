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
  owner: string | null;
  last_updated: string | null;
  priority: string | null;
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
