# Capstan

Policy-bound payment agent for PayPal. AI drafts invoices, payouts, and captures; your rules and explicit approvals control when funds move.

| | |
| --- | --- |
| **Status** | Early development — application scaffold not yet published |
| **License** | [MIT](./LICENSE) |
| **Environment** | PayPal Developer sandbox for local and staging work |

## Overview

Small businesses and agencies often run contractor and vendor payments through PayPal. Delegating the same workflow to an AI assistant without guardrails is unsafe: wrong recipient, wrong amount, or irreversible actions.

Capstan sits between operators and PayPal:

- **Policies** — express limits and conditions in plain language (spend caps, allowlists, actions that always require approval).
- **Agent** — prepares the appropriate PayPal operation using server-side AI and PayPal APIs or tooling.
- **Approval queue** — human review before execution by default.
- **Audit trail** — record of proposals, decisions, and PayPal outcomes.
- **Finance cockpit** — live transaction views and analytics (AG Studio / AG Grid).

**Initial focus:** agencies and solo operators paying contractors against milestones.

## How it works

```
Operator → Rules & approvals UI → Policy engine → Agent (LLM + PayPal tools)
                                        ↓
                                PayPal APIs / MCP
                                        ↓
                         Event stream → Dashboard + audit log
```

Design details: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## Capabilities (roadmap)

| Area | Description |
| --- | --- |
| Policy layer | Caps, allowlists, and mandatory approval for high-risk operations |
| PayPal integration | Sandbox-first; Orders, Invoicing, Payouts, or Subscriptions (surface TBD) |
| Agent runtime | Tool calling with PayPal [MCP server](https://developer.paypal.com/ai-tools/mcp-server) and/or REST |
| Operations UI | Queue, history, and configuration |
| Dashboard | Streaming or polled transaction data with interactive grids and charts |

## Stack

| Layer | Technology |
| --- | --- |
| Application | Next.js (App Router), TypeScript |
| Payments | PayPal Developer Platform |
| Agent | OpenAI or Anthropic (server-side only) |
| Analytics UI | AG Studio / AG Grid |

## Repository structure

```
capstan/
├── docs/           Architecture and internal build notes
├── frontend/       Web application (upcoming)
├── LICENSE
├── PROGRESS.md     Development log
└── .env.example    Environment template (no secrets)
```

## Getting started

The installable application is not available yet. When the first release lands in `frontend/`:

1. Clone this repository.
2. Register a [PayPal Developer](https://developer.paypal.com/) application and use **sandbox** credentials.
3. Copy `.env.example` to `.env.local` and set the documented variables.
4. Follow the setup instructions in `frontend/README.md`.

Until then, see [docs/BUILD-PLAN.md](./docs/BUILD-PLAN.md) for the implementation roadmap (maintainers).

## Security

- Never commit `.env`, `.env.local`, or API secrets.
- Use sandbox credentials and test accounts during development unless explicitly configured otherwise.
- Refunds, subscription changes, and similar irreversible PayPal actions require explicit approval in the product model.

## Contributing

Issues and pull requests are welcome once the application scaffold is in place. Please open an issue before large changes.

## License

MIT — see [LICENSE](./LICENSE).
