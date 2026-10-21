# Capstan frontend

Next.js operator console: AI draft, policy check, operator review, PayPal sandbox checkout, persistent audit log.

## Setup

```bash
cd frontend
cp ../.env.example .env.local
```

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Sandbox Client ID (browser) |
| `PAYPAL_CLIENT_ID` | Same Client ID (server) |
| `PAYPAL_CLIENT_SECRET` | Sandbox secret, server only |
| `PAYPAL_ENVIRONMENT` | `sandbox` |
| `OPENAI_API_KEY` | Optional; local parser works without it |
| `OPENAI_MODEL` | Optional, default `gpt-4o-mini` |
| `CAPSTAN_MAX_PAYMENT_USD` | Optional, default `500` |

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000/app](http://localhost:3000/app) and [http://localhost:3000/app/dashboard](http://localhost:3000/app/dashboard).

PayPal MCP token: `npm run mcp:token` (see [../docs/PAYPAL-MCP.md](../docs/PAYPAL-MCP.md)).

## Judge test path

1. **Draft with AI** using the sample or your own sentence.
2. Edit fields if needed, **Continue to review**, **Continue to PayPal**.
3. Popup: **Log in** with **Personal US** sandbox buyer (not Business).
4. Confirm capture and **Audit trail** (stored in `.data/audit-events.json`).
5. **Try policy block** on Console, then **Policy** preset on Dashboard.
6. **Export CSV** and select a row for **Event inspector**.

Health: `GET /api/health`

## PayPal generic error after login

Usually payee account restriction. Use a **US Business** on the app and **US Personal** buyer. See root [README](../README.md).
