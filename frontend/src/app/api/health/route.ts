import { getPayPalEnvironment } from "@/lib/paypal/config";

export async function GET() {
  const hasSecret = Boolean(process.env.PAYPAL_CLIENT_SECRET);
  const hasClientId = Boolean(
    process.env.PAYPAL_CLIENT_ID ?? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  );

  return Response.json({
    ok: hasSecret && hasClientId,
    paypal: getPayPalEnvironment(),
    service: "capstan",
  });
}
