/**
 * Prints a short lived PayPal sandbox access token for @paypal/mcp setup.
 * Run from repo root: node scripts/print-mcp-token.mjs
 * Reads frontend/.env.local (PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENVIRONMENT).
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, "frontend", ".env.local");

function loadEnv(path) {
  if (!existsSync(path)) {
    console.error("Missing frontend/.env.local. Copy .env.example and add PayPal sandbox keys.");
    process.exit(1);
  }
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

const env = loadEnv(envPath);
const id = env.PAYPAL_CLIENT_ID || env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const secret = env.PAYPAL_CLIENT_SECRET;
const sandbox = (env.PAYPAL_ENVIRONMENT || "sandbox").toLowerCase() !== "live";
const base = sandbox ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";

if (!id || !secret) {
  console.error("Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in frontend/.env.local");
  process.exit(1);
}

const credentials = Buffer.from(`${id}:${secret}`).toString("base64");
const res = await fetch(`${base}/v1/oauth2/token`, {
  method: "POST",
  headers: {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: "grant_type=client_credentials",
});

if (!res.ok) {
  console.error("OAuth failed:", res.status, await res.text());
  process.exit(1);
}

const { access_token, expires_in } = await res.json();
console.log("\nPayPal sandbox access token (expires in ~" + expires_in + "s):\n");
console.log(access_token);
console.log("\nUse with Cursor MCP — see docs/PAYPAL-MCP.md\n");
