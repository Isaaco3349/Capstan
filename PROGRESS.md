# Capstan progress log

## Done

- Phase 1: PayPal Orders sandbox checkout, policy cap, review flow, operator UI.
- Sandbox pairing documented: US Business app plus US Personal buyer.
- Audit log persisted to `frontend/.data/audit-events.json`.
- Phase 2: Agent draft panel with local parser (no OpenAI cost) plus optional OpenAI.
- AG Grid dashboard: presets, NL shortcuts, CSV export, stats, event inspector, badge renderers.
- Submission pack: `docs/DEVPOST.md`, `docs/JUDGE-DEMO.md`, `docs/PAYPAL-MCP.md`, MCP token script.
- Console: **Try policy block** for repeatable demo of governance.

## Before submit

- Public GitHub repo with MIT visible in About.
- Devpost: paste from `docs/DEVPOST.md`, attach video under 3 min.
- Optional: Vercel deploy for demo URL.

## Optional later

- AG Studio widgets.
- Webhooks instead of poll refresh.
- Payee allowlists in policy engine.

## Decisions

| Date | Decision |
| --- | --- |
| 2026-10-05 | Product name Capstan; Merchant PayPal app. |
| 2026-10-21 | US sandbox Business plus US Personal for reliable checkout. |
| 2026-10-21 | File based audit for demo reliability. |
| 2026-10-21 | Local parser default; OpenAI optional. |
| 2026-10-21 | MCP documented as judge tooling, not duplicate checkout path. |
