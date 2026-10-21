import { getPayPalApiBase, getPayPalClientId, getPayPalClientSecret } from "./config";

type TokenCache = { token: string; expiresAt: number };

let cache: TokenCache | null = null;

export async function getPayPalAccessToken(): Promise<string> {
  if (cache && Date.now() < cache.expiresAt - 60_000) {
    return cache.token;
  }

  const base = getPayPalApiBase();
  const credentials = Buffer.from(
    `${getPayPalClientId()}:${getPayPalClientSecret()}`,
  ).toString("base64");

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PayPal OAuth failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };

  cache = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}
