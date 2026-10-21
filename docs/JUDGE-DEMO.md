# Judge demo (90 seconds live)

Assumes US Business sandbox app credentials and US Personal buyer at PayPal popup. Full detail: root [README](../README.md).

## Path A — Happy path (60s)

1. Open `/app`.
2. Agent box: `Pay Alex Chen $250 for homepage delivery` → **Draft with AI**.
3. Confirm green **Applied to form** and **AI draft** badge.
4. **Continue to review** → confirm summary → **Pay with PayPal** → log in as **Personal US buyer** → Pay.
5. Open **Dashboard** → **Refresh** → **Captures** → click a row → read **Event inspector**.

## Path B — Policy + AG Grid (30s)

1. Back to **Console** → **Try policy block** (fills $750).
2. **Continue to review** → blocked message; audit shows **policy blocked**.
3. **Dashboard** → preset **Policy** → **Export CSV**.

## Path C — Optional MCP (for technical judges)

1. `node scripts/print-mcp-token.mjs`
2. Configure `@paypal/mcp` in Cursor per [PAYPAL-MCP.md](./PAYPAL-MCP.md).
3. Cross check MCP order list with grid **Order ID** column.

## What to look for

| Criterion | Capstan evidence |
| --- | --- |
| PayPal + AI | Agent draft + real Orders capture |
| Innovation | Policy gate before PayPal; not headless auto pay |
| Design | Stepper, audit timeline, dark finance grid |
| Presentation | Persistent audit + CSV export + reproducible README |
