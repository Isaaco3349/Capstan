import { appendAudit } from "@/lib/audit";
import { capturePayPalOrder } from "@/lib/paypal/orders";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { orderId?: string };
    const orderId = body.orderId?.trim();
    if (!orderId) {
      return Response.json({ error: "orderId required" }, { status: 400 });
    }

    const result = await capturePayPalOrder(orderId);

    await appendAudit({
      type: "paypal.captured",
      summary: `Captured order ${result.id} (${result.status})`,
      meta: {
        orderId: result.id,
        captureId: result.captureId,
      },
    });

    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await appendAudit({ type: "paypal.error", summary: message });
    return Response.json({ error: message }, { status: 500 });
  }
}
