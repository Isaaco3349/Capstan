export type PayPalEnvironment = "sandbox" | "live";

export function getPayPalEnvironment(): PayPalEnvironment {
  const env = process.env.PAYPAL_ENVIRONMENT?.toLowerCase();
  return env === "live" ? "live" : "sandbox";
}

export function getPayPalApiBase(): string {
  return getPayPalEnvironment() === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export function getPayPalClientId(): string {
  const id =
    process.env.PAYPAL_CLIENT_ID ?? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  if (!id) {
    throw new Error(
      "Missing PAYPAL_CLIENT_ID (server) or NEXT_PUBLIC_PAYPAL_CLIENT_ID",
    );
  }
  return id;
}

export function getPayPalClientSecret(): string {
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!secret) {
    throw new Error("Missing PAYPAL_CLIENT_SECRET");
  }
  return secret;
}

export function getPublicPayPalClientId(): string {
  const id = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  if (!id) {
    throw new Error("Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID for checkout UI");
  }
  return id;
}
