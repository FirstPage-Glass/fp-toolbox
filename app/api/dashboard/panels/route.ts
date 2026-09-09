import { NextResponse } from "next/server";
import { currentUsername } from "@/lib/auth";
import { getWebsitePsi } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

/**
 * PSI panel, fetched client-side after the shell hydrates — the dashboard
 * document never waits on the slow psi_audit (memoized 6h), so skeletons
 * render first and data fills in later. AI plans live in
 * /api/dashboard/plans: a fresh generation takes up to ~90s and must not
 * delay this endpoint's response.
 */
export async function GET() {
  const user = await currentUsername();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const psi = await getWebsitePsi();
  return NextResponse.json({ psi });
}
