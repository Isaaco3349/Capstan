# Capstan

Policy bound payment agent for PayPal. AI drafts contractor payouts from natural language. Policy caps and operator review run before sandbox checkout. Every step is logged and explorable in AG Grid.

| | |
| --- | --- |
| **Status** | Demo ready: agent draft, policy gate, PayPal Orders capture, audit dashboard |
| **License** | [MIT](./LICENSE) |
| **Stack** | Next.js, PayPal Sandbox, AG Grid Community, optional OpenAI |

## Why this stands out

Most hackathon entries stop at “chat pays.” Capstan is built for **operators**:

- **Governance first** — Policy blocks overspend before PayPal API calls; approvals are explicit.
- **Real PayPal** — Orders v2 create and capture in sandbox, not a mock button.
- **Audit you can ship to finance** — Persistent event log plus AG Grid dashboard (filters, CSV export, row inspector).
- **AI without a toll booth** — Local parser works with no OpenAI credits; upgrade when you want.
- **PayPal MCP story** — Same sandbox credentials power `@paypal/mcp` in Cursor for cross checking orders ([docs/PAYPAL-MCP.md](./docs/PAYPAL-MCP.md)).

Submission copy: [docs/DEVPOST.md](./docs/DEVPOST.md). Live demo script: [docs/JUDGE-DEMO.md](./docs/JUDGE-DEMO.md).

## What it does

Capstan targets agencies and small teams that pay contractors on PayPal. An agent turns plain language into a structured payment proposal. The operator reviews, policy is checked, then PayPal sandbox checkout captures funds. Nothing executes without human confirmation.

## Features

| Feature | Description |
| --- | --- |
| Agent draft | Local parser by default; optional OpenAI when API key is set |
| AG Grid dashboard | `/app/dashboard` — presets, NL view shortcuts, CSV export, event inspector |
| Policy | Configurable max single payment (`CAPSTAN_MAX_PAYMENT_USD`, default 500) |
| Review | Operator confirms before PayPal |
| PayPal | Orders v2 create and capture in sandbox |
| Audit | JSON file store under `frontend/.data/` survives dev server restarts |
| MCP helper | `node scripts/print-mcp-token.mjs` for PayPal MCP in Cursor |

## Sandbox requirements (important)

PayPal sandbox is picky about account pairing:

1. **App credentials** (`PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`) belong to a **US Business** sandbox account linked to your app.
2. At checkout, log in with a **US Personal (buyer)** sandbox account only. Do not use the Business seller account in the popup.
3. `.env.local` is for API keys, not for PayPal login.
4. Nigeria Business plus US buyer often fails with payee restriction errors. Use US Business plus US Personal for demos.

Details: [frontend/README.md](./frontend/README.md).

## Quick start

```bash
git clone https://github.com/Isaaco3349/Capstan.git
cd Capstan/frontend
cp ../.env.example .env.local
```

Fill in:

- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_ID` (same sandbox client id)
- `PAYPAL_CLIENT_SECRET`
- `OPENAI_API_KEY` (optional; local agent works without it)
- `PAYPAL_ENVIRONMENT=sandbox`

```bash
npm install
npm run dev
```

Open [http://localhost:3000/app](http://localhost:3000/app) and [http://localhost:3000/app/dashboard](http://localhost:3000/app/dashboard).

## Demo script (2 minutes)

1. **Console:** Natural language → **Draft with AI** → **Continue to review** → PayPal checkout (Personal US buyer).
2. **Console:** **Try policy block** → continue → see block in audit (never reaches PayPal).
3. **Dashboard:** **Refresh** → **Captures** / **Policy** → select row → **Event inspector** → **Export CSV**.
4. **Optional:** PayPal MCP in Cursor per [docs/PAYPAL-MCP.md](./docs/PAYPAL-MCP.md).

## Repository layout

```
capstan/
├── frontend/          Next.js app (run npm commands here)
├── docs/              DEVPOST, judge demo, MCP, architecture
├── scripts/           print-mcp-token.mjs
├── LICENSE
├── PROGRESS.md
└── .env.example
```

## Security

Never commit `.env.local` or secrets. Use sandbox only unless you explicitly configure live credentials.

## License

MIT. See [LICENSE](./LICENSE).
