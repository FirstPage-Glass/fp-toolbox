import { fetchAllTools, type NocoDBTool } from "./nocodb";

// Categories from NocoDB schema: Automation, Reporting, Content, Utility, System
export type UnifiedToolCategory =
  | "Automation"
  | "Reporting"
  | "Content"
  | "Utility"
  | "System";

export interface UnifiedTool {
  id: string;
  name: string;
  category: UnifiedToolCategory;
  description: string;
  techStack: string[];
  tags: string[];
  status: string;
  slug: string | null;
  url: string | null;
  repoUrl: string | null;
  hasWebUi: boolean;
  impact: string;
  quickAccess: boolean;
  lastUsed: string | null;
  owner: string | null;
  priority: string | null;
  source: "static" | "nocodb";
  lastUpdated: string | null;
  type: string[];
  coverImage: string | null;
  serve: string[];
}

export type UnifiedToolFilter = {
  search?: string;
  category?: UnifiedToolCategory | "All";
  tags?: string[];
  hasWebUi?: boolean;
  source?: "static" | "nocodb" | "All";
};

function nocoDbToUnifiedTool(tool: NocoDBTool): UnifiedTool {
  const techStack = tool.tech_stack
    ? tool.tech_stack.split(/[+,]/).map((t) => t.trim()).filter(Boolean)
    : [];

  const hasLiveLink = Boolean(tool.live_link);
  const hasGhLink = Boolean(tool.gh_link);

  const tags = [
    tool.category,
    tool.status,
    tool.priority,
    ...(hasGhLink ? ["Open Source"] : []),
    ...(hasLiveLink ? ["Live"] : []),
    ...techStack.slice(0, 3),
  ].filter((t): t is string => Boolean(t));

  const coverImage = tool.cover_image && tool.cover_image.length > 0
    ? (tool.cover_image[0].thumbnails?.card_cover?.signedPath
        ? `https://nocodb.firstpage.com.hk/${tool.cover_image[0].thumbnails.card_cover.signedPath}`
        : tool.cover_image[0].signedPath
          ? `https://nocodb.firstpage.com.hk/${tool.cover_image[0].signedPath}`
          : null)
    : null;

  return {
    id: `nocodb-${tool.Id}`,
    name: tool.name,
    category: (tool.category as UnifiedToolCategory) || "Automation",
    description: tool.description || "",
    techStack,
    tags,
    status: tool.status || "Unknown",
    slug: tool.slug || null,
    url: tool.live_link || null,
    repoUrl: tool.gh_link || null,
    hasWebUi: hasLiveLink,
    impact: "",
    quickAccess: tool.priority === "High",
    lastUsed: null,
    owner: tool.owner,
    priority: tool.priority,
    source: "nocodb",
    lastUpdated: tool.UpdatedAt || null,
    type: tool.type || [],
    coverImage,
    serve: tool.serve || [],
  };
}

export async function fetchAllUnifiedTools(): Promise<UnifiedTool[]> {
  const nocoDbTools = await fetchAllTools();
  const unifiedFromNoco = nocoDbTools.map(nocoDbToUnifiedTool);
  return unifiedFromNoco;
}

export function filterTools(
  tools: UnifiedTool[],
  filters: UnifiedToolFilter
): UnifiedTool[] {
  let results = [...tools];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase().trim();
    if (searchLower) {
      results = results.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchLower) ||
          tool.description.toLowerCase().includes(searchLower) ||
          tool.techStack.some((tech) =>
            tech.toLowerCase().includes(searchLower)
          ) ||
          tool.tags.some(
            (tag) => tag && tag.toLowerCase().includes(searchLower)
          ) ||
          (tool.owner && tool.owner.toLowerCase().includes(searchLower))
      );
    }
  }

  if (filters.category && filters.category !== "All") {
    results = results.filter((t) => t.category === filters.category);
  }

  if (filters.source && filters.source !== "All") {
    results = results.filter((t) => t.source === filters.source);
  }

  if (filters.tags && filters.tags.length > 0) {
    results = results.filter((t) =>
      filters.tags!.some((tag) => t.tags.includes(tag))
    );
  }

  if (filters.hasWebUi !== undefined) {
    results = results.filter((t) => t.hasWebUi === filters.hasWebUi);
  }

  return results;
}

export function getAllTags(tools: UnifiedTool[]): string[] {
  const tags = new Set<string>();
  tools.forEach((tool) => tool.tags.forEach((tag) => tag && tags.add(tag)));
  return Array.from(tags).sort();
}
