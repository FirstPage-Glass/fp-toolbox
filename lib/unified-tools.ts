import { fetchAllTools, type NocoDBTool } from "./nocodb";

export type UnifiedToolCategory = "AI" | "Automation" | "Reporting" | "Content" | "Internal" | "Analytics";

export interface UnifiedTool {
  id: string;
  name: string;
  category: UnifiedToolCategory;
  description: string;
  techStack: string[];
  tags: string[];
  status: string;
  url: string | null;
  repoUrl: string | null;
  hasWebUi: boolean;
  impact: string;
  quickAccess: boolean;
  lastUsed: string | null;
  favorite: boolean;
  owner: string | null;
  priority: string | null;
  source: "static" | "nocodb";
  lastUpdated: string | null;
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

  const tags = [
    tool.category,
    tool.status,
    tool.priority,
    ...techStack,
  ].filter((t): t is string => Boolean(t));

  return {
    id: `nocodb-${tool.Id}`,
    name: tool.name,
    category: tool.category as UnifiedToolCategory,
    description: tool.description || "",
    techStack,
    tags,
    status: tool.status || "Unknown",
    url: tool.documentation_url,
    repoUrl: tool.repository_path,
    hasWebUi: false,
    impact: "",
    quickAccess: tool.priority === "High",
    lastUsed: null,
    favorite: false,
    owner: tool.owner,
    priority: tool.priority,
    source: "nocodb",
    lastUpdated: tool.UpdatedAt || null,
  };
}

export async function fetchAllUnifiedTools(): Promise<UnifiedTool[]> {
  const nocoDbTools = await fetchAllTools();
  const unifiedFromNoco = nocoDbTools.map(nocoDbToUnifiedTool);

  // We'll only use NocoDB tools for now since that's the live source
  // In the future, we could merge with static tools from data.ts
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
          tool.techStack.some((tech) => tech.toLowerCase().includes(searchLower)) ||
          tool.tags.some((tag) => tag && tag.toLowerCase().includes(searchLower)) ||
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
