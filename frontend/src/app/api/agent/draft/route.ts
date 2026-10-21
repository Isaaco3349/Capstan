import { appendAudit } from "@/lib/audit";
import { draftPaymentFromText } from "@/lib/agent/draft-payment";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { message?: string };
    const message = body.message?.trim();
    if (!message) {
      return Response.json({ error: "message is required" }, { status: 400 });
    }

    const draft = await draftPaymentFromText(message);

    await appendAudit({
      type: "agent.draft",
      summary: draft.agentSummary,
      meta: {
        payee: draft.payeeLabel,
        amountUsd: draft.amountUsd,
        milestone: draft.milestone,
        mode: draft.mode,
      },
    });

    return Response.json({
      draft: {
        payeeLabel: draft.payeeLabel,
        amountUsd: draft.amountUsd,
        milestone: draft.milestone,
        memo: draft.memo,
      },
      mode: draft.mode,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Agent draft failed";
    await appendAudit({ type: "paypal.error", summary: `Agent: ${message}` });
    return Response.json({ error: message }, { status: 500 });
  }
}
