import pitchDeck from "@/app/tools/pitch-deck/tool";
import proposal from "@/app/tools/proposal/tool";

export interface ToolManifest {
  slug: string;
  name: string;
  description: string;
  category: string;
  owner: string;
  status: "active" | "deprecated" | "planned";
  model?: string;
  externalLink?: string;
  icon?: string;
}

/** Static registry index — adding a tool = add one import line. Code is the source of truth. */
export const tools: ToolManifest[] = [pitchDeck, proposal];
