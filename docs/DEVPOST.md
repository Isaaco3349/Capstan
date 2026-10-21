# Devpost submission (copy and paste)

Use this for [PayPal AI Hackathon](https://paypalaihackathon.devpost.com/). Replace `YOUR_DEMO_URL` and `YOUR_VIDEO_URL` before submit.

---

## Project name

Capstan

## Elevator pitch (tagline)

Policy bound PayPal agent for contractor payouts: AI drafts, humans approve, every dollar is audited in AG Grid.

## About the project

### Inspiration

Agentic commerce breaks the moment an AI can move money without rules operators can see. Agencies paying contractors on PayPal need speed, but not unchecked automation.

### What it does

Capstan is an operator console for milestone contractor payouts on PayPal sandbox:

1. **Draft** — Plain language in the console (local parser by default, optional OpenAI) turns intent into a structured payment proposal.
2. **Policy** — Configurable single payment cap blocks overspend before any PayPal call.
3. **Review** — Operator confirms payee, amount, and milestone copy.
4. **Checkout** — PayPal Orders v2 create and capture via official React SDK.
5. **Audit** — Every step persists to a file backed log and appears in an **AG Grid Community** finance dashboard with presets, column filters, CSV export, and natural language view shortcuts.

Capstan is the control layer: the agent proposes, policy and humans decide, PayPal executes.

### How we built it

- **Next.js 15** app with server routes for PayPal OAuth, Orders API, policy, and agent draft.
- **PayPal** sandbox REST (create order, capture) plus `@paypal/react-paypal-js` for buyer checkout.
- **AI** — Structured draft endpoint with a zero cost local parser when `OPENAI_API_KEY` is unset; OpenAI JSON mode when configured.
- **AG Grid v33** — Community modules: sorting, filtering, custom cell renderers, row selection with event inspector, CSV export, quick filter.
- **PayPal MCP** — Documented sidecar setup (`@paypal/mcp`) for Cursor and Claude using the same sandbox credentials (see `docs/PAYPAL-MCP.md`).

### Challenges

PayPal sandbox account pairing: US Business app credentials plus US Personal buyer at checkout. Nigeria merchant with US buyer hit payee restrictions; we documented the working pair in the README so judges can reproduce.

### Accomplishments

End to end sandbox capture with a persistent audit trail that survives dev server restarts, plus a dashboard that makes sponsor AG Grid review straightforward.

### What we learned

The winning demo is not “chat pays” — it is **visible governance**: policy block, approval, PayPal lifecycle IDs, and a grid finance operators would actually use.

### What's next

Production webhooks, payee allowlists, optional PayPal Agent Toolkit tool routing behind the same policy gate, AG Studio widgets for richer analytics.

---

## Built with

- Next.js, React, TypeScript
- PayPal Developer Platform (Orders v2, sandbox)
- PayPal React SDK
- PayPal MCP (`@paypal/mcp`) — optional operator tooling
- AG Grid Community
- OpenAI API (optional)

---

## Links

| Field | Value |
| --- | --- |
| **GitHub** | https://github.com/Isaaco3349/Capstan |
| **Demo URL** | YOUR_DEMO_URL (Vercel or `http://localhost:3000` for video) |
| **Video** | YOUR_VIDEO_URL (under 3 minutes) |

---

## Suggested video outline (2:30)

1. **0:00** Landing → Console. One sentence problem.
2. **0:20** Paste natural language → **Draft with AI** → green “Applied to form”.
3. **0:45** **Continue to review** → approve → PayPal sandbox popup (US Personal buyer) → capture.
4. **1:30** **Dashboard** → Refresh → **Captures** preset → **Apply view** `policy blocks` → select row → event inspector → **Export CSV**.
5. **2:00** **Try policy block** on Console ($750 vs $500 cap) → show red block in audit and grid.
6. **2:20** GitHub + MIT + optional MCP doc flash.

---

## AG Grid sponsor note (for judges)

Capstan uses AG Grid as the **primary finance cockpit**, not a static table: filtered views for captures, policy blocks, and agent drafts; NL shortcuts map to grid filter models; operators export audit CSV for reconciliation. See `/app/dashboard`.
