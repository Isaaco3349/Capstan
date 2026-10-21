import { listAudit } from "@/lib/audit";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number.parseInt(searchParams.get("limit") ?? "50", 10);
  const events = await listAudit(Number.isFinite(limit) ? limit : 50);
  return Response.json({ events });
}
