import { getPayPalAccessToken } from "./auth";
import { getPayPalApiBase } from "./config";

export type CreateOrderInput = {
  amountUsd: string;
  description: string;
  referenceId?: string;
};

export async function createPayPalOrder(input: CreateOrderInput): Promise<{
  id: string;
  status: string;
}> {
  const token = await getPayPalAccessToken();
  const base = getPayPalApiBase();

  const res = await fetch(`${base}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: input.referenceId ?? "capstan-draft",
          description: input.description,
          amount: {
            currency_code: "USD",
            value: input.amountUsd,
          },
        },
      ],
      application_context: {
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `PayPal create order failed (${res.status}): ${JSON.stringify(data)}`,
    );
  }

  return { id: data.id as string, status: data.status as string };
}

export async function capturePayPalOrder(orderId: string): Promise<{
  id: string;
  status: string;
  captureId?: string;
}> {
  const token = await getPayPalAccessToken();
  const base = getPayPalApiBase();

  const res = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `PayPal capture failed (${res.status}): ${JSON.stringify(data)}`,
    );
  }

  const captureId =
    data.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? undefined;

  return {
    id: data.id as string,
    status: data.status as string,
    captureId,
  };
}
