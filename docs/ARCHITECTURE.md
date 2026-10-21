# Architecture

Capstan is a **policy bound payment agent** for teams using **PayPal sandbox**. AI proposes structured payouts; **operators approve**; PayPal Orders execute; **AG Grid** surfaces the audit stream.

## Principles

1. **PayPal is central** — Orders v2 checkout (create + capture) in the demo path.
2. **Agentic with guardrails** — Draft endpoint plus optional OpenAI; policy engine before any PayPal REST call.
3. **Confirm first** — Compose → review → checkout; no silent capture.
4. **Auditable** — Append only event log (file backed) feeding console timeline and dashboard grid.

## Components

| Layer | Responsibility |
| --- | --- |
| **Next.js UI** | Operator console, marketing landing, AG Grid dashboard |
| **Policy** | `CAPSTAN_MAX_PAYMENT_USD` cap; blocks emit `policy.blocked` audit events |
| **Agent** | `/api/agent/draft` — local parser or OpenAI structured JSON |
| **PayPal adapter** | Server OAuth, create order, capture order; React SDK for buyer UI |
| **Audit store** | `frontend/.data/audit-events.json` |
| **MCP (optional)** | `@paypal/mcp` in Cursor; token via `scripts/print-mcp-token.mjs` |

## User flow

1. Operator describes payment (NL or form).
2. Agent or manual draft fills payment details.
3. Policy POST on review transition; block or allow.
4. Operator approves → PayPal order created → buyer completes sandbox checkout → capture.
5. Dashboard queries audit API with filters and export.

## Integrations

| Tool | Role in Capstan |
| --- | --- |
| PayPal Developer Platform | Sandbox Orders, OAuth |
| `@paypal/react-paypal-js` | Checkout buttons |
| `@paypal/mcp` | Documented operator sidecar (not in app hot path) |
| OpenAI (optional) | Richer NL parsing |
| AG Grid Community | Finance dashboard |

## Out of scope (demo)

- Live production money
- Multi tenant merchants
- Non PayPal rails
