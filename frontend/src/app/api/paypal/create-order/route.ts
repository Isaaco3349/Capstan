import { appendAudit } from "@/lib/audit";
import { createPayPalOrder } from "@/lib/paypal/orders";
import { evaluatePayment } from "@/lib/policy";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      amountUsd?: string;
      description?: string;
      payeeLabel?: string;
      milestone?: string;
    };

    const amountStr = body.amountUsd?.trim();
    const amount = amountStr ? Number.parseFloat(amountStr) : NaN;
    const description =
      body.description?.trim() ||
      `Contractor payment${body.milestone ? `: ${body.milestone}` : ""}`;

    const policy = evaluatePayment(amount);
    if (!policy.allowed) {
      await appendAudit({
        type: "policy.blocked",
        summary: policy.reason,
        meta: { amountUsd: amount, capUsd: policy.capUsd },
      });
      return Response.json({ error: policy.reason }, { status: 422 });
    }

    const amountUsd = amount.toFixed(2);

    await appendAudit({
      type: "payment.approved",
      summary: `Operator approved ${body.payeeLabel ?? "payee"} for $${amountUsd}`,
      meta: {
        payee: body.payeeLabel,
        milestone: body.milestone,
        amountUsd,
      },
    });

    const order = await createPayPalOrder({
      amountUsd,
      description,
      referenceId: body.milestone?.slice(0, 127),
    });

    await appendAudit({
      type: "paypal.order_created",
      summary: `PayPal order ${order.id} created (${order.status})`,
      meta: { orderId: order.id, amountUsd },
    });

    return Response.json({ id: order.id, status: order.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await appendAudit({ type: "paypal.error", summary: message });
    return Response.json({ error: message }, { status: 500 });
  }
}
