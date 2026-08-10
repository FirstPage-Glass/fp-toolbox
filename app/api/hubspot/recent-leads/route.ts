import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRecentLeads, scoreLead } from "@/lib/hubspot";

export async function GET() {
  // Contact data is personal — require login (unlike the public toolbox)
  const user = (await cookies()).get("fp-auth")?.value;
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const leads = await getRecentLeads(7);
    const scored = await Promise.all(
      leads.map(async (l) => ({ ...l, score: await scoreLead(l.email, l.website) }))
    );
    return NextResponse.json({ leads: scored });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "HubSpot fetch failed" },
      { status: 500 }
    );
  }
}