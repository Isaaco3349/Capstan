import { appendAudit } from "@/lib/audit";
import { evaluatePayment, getPolicyCapUsd } from "@/lib/policy";

export async function GET() {
  return Response.json({ capUsd: getPolicyCapUsd() });
}

export async function POST(req: Request) {
  const body = (await req.json()) as { amountUsd?: number };
  const amount = Number(body.amountUsd);
  const result = evaluatePayment(amount);
  if (!result.allowed) {
    await appendAudit({
      type: "policy.blocked",
      summary: result.reason,
      meta: { amountUsd: amount, capUsd: result.capUsd },
    });
  }
  return Response.json(result);
}
