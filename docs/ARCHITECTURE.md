# Architecture (planned)

Capstan is a **policy-bound payment agent** for small businesses using **PayPal sandbox** in development. AI proposes and prepares money movement; **humans approve** (or auto-execute only within explicit caps). A **live finance cockpit** (AG Studio) shows transactions, anomalies, and agent activity.

## Principles

1. **PayPal is central** — Orders, Invoicing, Payouts, or Subscriptions (final API set locked in Phase 1); not a chat wrapper around unrelated rails.
2. **Agentic, not decorative** — LLM tool calls (PayPal REST and/or [PayPal MCP](https://developer.paypal.com/ai-tools/mcp-server)) drive real sandbox actions after policy checks.
3. **Confirm-first autonomy** — Default: queue → approve → execute. Optional: auto-pay under per-payee and daily caps defined in plain language.
4. **Auditable** — Every tool call, approval, and PayPal response id logged for judges and operators.

## Logical components

| Layer | Responsibility |
| --- | --- |
| **Web app** | Next.js UI: rules, approval queue, audit log, AG Studio embed |
| **Policy engine** | Parse/store rules (caps, allowlists, blocked actions); evaluate before execute |
| **Agent service** | LLM + tool schema; drafts actions; never bypasses policy |
| **PayPal adapter** | Sandbox OAuth, webhooks (or polling), idempotent captures/payouts |
| **Event stream** | Normalized txn events → AG Studio data source |
| **Persistence** | SQLite or Postgres (TBD Phase 1); rules, approvals, audit entries |

## Planned user flow (demo)

1. Operator describes rules in natural language (e.g. pay contractor up to $500 when milestone marked complete).
2. Agent interprets → structured policy + suggested PayPal action (invoice, payout, order).
3. Action appears in **approval queue** with human-readable summary.
4. Operator approves → PayPal sandbox executes → webhook/poll updates cockpit.
5. Agent may add cockpit widgets (e.g. refund spike alert) from stream analysis.

## Integrations (hackathon)

| Tool | Role |
| --- | --- |
| PayPal Developer Platform | Sandbox payments, webhooks simulator |
| PayPal AI Toolkit / MCP | Agent tools for PayPal operations |
| AI model (OpenAI or Anthropic) | Reasoning + tool calling |
| AG Studio / AG Grid | Merchant dashboard, NL-assisted widgets |
| Render or Vercel (TBD) | Hosted demo for judges |

## Out of scope (v1)

- Production PayPal live money
- Multi-tenant merchant onboarding
- Custom blockchain or non-PayPal settlement rails

## Security notes

- Secrets only in server environment variables.
- Destructive PayPal tools (refunds, subscription cancel) require explicit approval in product policy.
- Sandbox credentials and test buyer/seller logins documented in README for judges only (no real accounts).
