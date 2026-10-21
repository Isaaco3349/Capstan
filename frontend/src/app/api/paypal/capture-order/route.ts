import { appendAudit } from "@/lib/audit";
import { capturePayPalOrder } from "@/lib/paypal/orders";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      orderId?: string;
      amountUsd?: string;
      payeeLabel?: string;
    };
    const orderId = body.orderId?.trim();
    if (!orderId) {
      return Response.json({ error: "orderId required" }, { status: 400 });
    }

    const result = await capturePayPalOrder(orderId);

    const amountUsd =
      result.amountUsd ??
      (body.amountUsd?.trim()
        ? Number.parseFloat(body.amountUsd).toFixed(2)
        : undefined);

    await appendAudit({
      type: "paypal.captured",
      summary: `Captured order ${result.id} (${result.status})`,
      meta: {
        orderId: result.id,
        captureId: result.captureId,
        amountUsd,
        payee: body.payeeLabel?.trim(),
      },
    });

    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await appendAudit({ type: "paypal.error", summary: message });
    return Response.json({ error: message }, { status: 500 });
  }
}
