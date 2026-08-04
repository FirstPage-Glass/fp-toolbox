import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRecentLeads } from "@/lib/hubspot";

export async function GET() {
  // Contact data is personal — require login (unlike the public toolbox)
  const user = (await cookies()).get("fp-auth")?.value;
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const leads = await getRecentLeads(3);
    return NextResponse.json({ leads });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "HubSpot fetch failed" },
      { status: 500 }
    );
  }
}
