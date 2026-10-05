# Capstan

**Policy-bound payment agent for PayPal** — AI prepares invoices, payouts, and captures; your rules and approvals decide when money actually moves.

Built for the [PayPal AI Hackathon](https://paypalaihackathon.devpost.com/) (Oct 1 – Nov 12, 2026).

| | |
| --- | --- |
| **Status** | Pre-development — repository and build plan only |
| **License** | [MIT](./LICENSE) |
| **Sandbox** | PayPal Developer (no live funds in dev) |

---

## Why Capstan

Small teams pay contractors and vendors through PayPal but cannot safely give an AI unchecked access to refunds, captures, or payouts. Capstan is the control layer: **natural-language policies**, an **approval queue**, a full **audit trail**, and a **live finance cockpit** so operators see what the agent did and why.

**Name:** A capstan holds line under control on a ship — same idea for payments under explicit caps and human oversight.

Earlier working titles: *Ledger Agent*, *PayPilot*.

---

## Problem → solution

| Problem | Capstan |
| --- | --- |
| Ad-hoc PayPal sends are error-prone | Agent drafts the right PayPal action from context |
| Autonomous AI + money is risky | Policies (caps, allowlists) + approve-by-default |
| Finance visibility lives in scattered logs | AG Studio dashboard fed by txn stream + agent insights |

**Primary persona (v1):** Solo founder or agency operator paying contractors on milestones.

---

## Planned features

- **Rules in plain English** — e.g. pay Alex up to $500 when milestone “Design” is marked complete; never refund without approval.
- **Agent with PayPal tools** — LLM tool calling and/or [PayPal MCP](https://developer.paypal.com/ai-tools/mcp-server) against **sandbox** only.
- **Approval queue** — Review, approve, or reject before execution.
- **Audit log** — Tool calls, PayPal correlation ids, outcomes.
- **Finance cockpit** — [AG Studio](https://www.ag-grid.com/) (AG Grid) for live views, aggregates, and AI-assisted widgets (e.g. anomaly highlights).

---

## Hackathon alignment

Capstan targets **overall prizes first**, then honorable mentions, then sponsor categories.

| Priority | Prize / criterion | Fit |
| --- | --- | --- |
| 1 | Grand (1st / 2nd / 3rd) | Full product loop, deep PayPal + AI, polished demo |
| 2 | Best Use of Agentic Commerce | Transact after policy + approval (or capped auto-pay) |
| 2 | Best Use of PayPal + AI | PayPal tools/MCP as core integration |
| 2 | Most Impactful | Credible SMB contractor-payments story |
| 3 | Best Use of AG Grid | AG Studio + streams + NL dashboard (not a static table) |

Details: [docs/BUILD-PLAN.md](./docs/BUILD-PLAN.md).

---

## Architecture

High-level design (implementation not started):

```
Operator → Rules + Approval UI → Policy engine → Agent (LLM + tools)
                                      ↓
                              PayPal sandbox APIs / MCP
                                      ↓
                              Events → AG Studio cockpit
                                      ↓
                              Audit log
```

Full notes: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

---

## Tech stack (planned)

| Layer | Choice |
| --- | --- |
| App | Next.js (App Router), TypeScript |
| Payments | PayPal Developer Platform (sandbox) |
| Agent | OpenAI or Anthropic (server-side); PayPal AI Toolkit / MCP |
| Dashboard | AG Studio / AG Grid |
| Deploy | Render or Vercel (TBD) |

---

## Repository layout

```
capstan/
├── docs/
│   ├── ARCHITECTURE.md    # System design (planned)
│   └── BUILD-PLAN.md      # ~2–3 week phased schedule
├── frontend/              # Next.js app (Phase 1)
├── LICENSE
├── PROGRESS.md            # Build log
├── .env.example
└── README.md
```

Application code lands in **Phase 1** per the build plan.

---

## Getting started

> **Not yet runnable.** Follow phases in [docs/BUILD-PLAN.md](./docs/BUILD-PLAN.md).

When Phase 1 is complete, setup will look like:

1. Clone the repo and open it in your editor.
2. Create a [PayPal Developer](https://developer.paypal.com/) sandbox app (Client ID + Secret).
3. Copy environment template: `cp .env.example .env.local` and fill values.
4. Install and run the frontend (instructions will be added under `frontend/`).

Judges: sandbox test account instructions will be in this README before submission.

---

## Build schedule (~2–3 weeks)

| Phase | Days | Outcome |
| --- | --- | --- |
| **0 — Bootstrap** | Now | Repo, docs, sandbox accounts |
| **1 — Foundation** | 1–4 | One end-to-end sandbox payment |
| **2 — Agent core** | 5–9 | Policies, queue, audit log |
| **3 — AG Studio** | 10–13 | Live cockpit + AI widget moment |
| **4 — Product shell** | 14–16 | Polish, errors, judge-ready README |
| **5 — Submission** | 17–21 | Video, Devpost, hosted demo |

See [docs/BUILD-PLAN.md](./docs/BUILD-PLAN.md) for checklists and exit criteria.

---

## Submission requirements (tracking)

- [ ] Public GitHub with **MIT** visible in repository About
- [ ] Working demo (hosted URL or build-from-source + test credentials)
- [ ] Demo video **&lt; 3 min** on YouTube
- [ ] PayPal sandbox integration central to the project
- [ ] AI integral to functionality (not decorative)

---

## Security

- Do not commit `.env`, `.env.local`, or PayPal secrets.
- Use **sandbox** credentials and test accounts only during development.
- High-risk PayPal operations (refunds, subscription cancel, etc.) require explicit human approval in product design.

---

## Contributing

This is a hackathon project. Issues and PRs welcome after the app scaffold exists (Phase 1).

---

## Acknowledgments

- [PayPal AI Hackathon](https://paypalaihackathon.devpost.com/) and Devpost
- PayPal Developer Platform and AI Toolkit documentation
- AG Grid / AG Studio (planned integration)

---

## Contact

Repository maintainer: add your Devpost / GitHub handle before submission.
