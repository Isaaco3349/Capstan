# Build plan (~2–3 weeks daily)

Target: **PayPal AI Hackathon** submission by **Nov 12, 2026 @ 12:00pm PT**.  
This schedule assumes **~15–21 focused build days** after repo bootstrap, with buffer for video and Devpost copy.

## Phase 0 — Repo bootstrap (current)

- [x] Project name, LICENSE (MIT), README, architecture sketch
- [x] PayPal sandbox app + accounts
- [x] Lock v1 PayPal API surface: **Orders v2 checkout (CAPTURE)**

## Phase 1 — Foundation (days 1–4)

**Goal:** Judges can run one happy-path sandbox payment from the repo.

- PayPal sandbox: client id/secret, business + personal test accounts
- Server-side PayPal auth and one primary flow (create → approve in sandbox UI → capture/paid)
- Minimal Next.js app shell (design tokens, layout, health check)
- README: clone, `cp .env.example .env.local`, install, run
- Webhook receiver **or** polling fallback + PayPal Webhooks Simulator docs for judges

**Exit criteria:** Documented curl or UI path that results in a visible sandbox transaction.

## Phase 2 — Agent core (days 5–9)

**Goal:** AI proposes PayPal actions; nothing executes without policy + approval.

- Policy model: caps, allowlisted emails/merchant ids, blocked tool names
- LLM tool definitions mirroring PayPal operations (start narrow: 3–5 tools)
- Approval queue API + UI (pending / approved / rejected / executed)
- Audit log (timestamp, actor, tool, PayPal correlation id, outcome)
- Optional: PayPal MCP wired on server with same guardrails as REST tools

**Exit criteria:** Demo script step: natural language rule → queued action → approve → sandbox success → audit entry.

## Phase 3 — AG Studio cockpit (days 10–13)

**Goal:** Sponsor-credible dashboard, not a static CSV grid.

- Stream normalized events into AG Studio (or Grid + Studio Agent Framework per AG docs)
- At least one **AI-driven dashboard moment** (NL query → widget/filter, or anomaly → suggested widget)
- Link cockpit rows to approval/audit records

**Exit criteria:** Video-ready segment: live or simulated feed updates after payment; one NL dashboard interaction.

## Phase 4 — Product shell (days 14–16)

**Goal:** Grand-prize “complete product” feel.

- Onboarding copy, empty states, error handling (declined payment, expired token)
- Settings: sandbox mode banner, test account hints for judges
- Mobile-responsive or clear desktop-first rationale in README

**Exit criteria:** New developer can follow README without author hand-holding.

## Phase 5 — Submission pack (days 17–21)

**Goal:** Devpost requirements satisfied.

- Public GitHub with LICENSE visible in repo About
- Hosted demo URL **or** exceptional local-only instructions + test credentials
- YouTube demo **under 3 minutes**, end-to-end, no copyrighted music
- Devpost description: problem, persona, PayPal + AI + AG Studio usage, testing steps

**Exit criteria:** Submission form complete; teammate dry-run follows README in &lt; 30 minutes.

## Prize alignment checklist

| Criterion / prize | How Capstan demonstrates it |
| --- | --- |
| Grand — Tech | Sandbox PayPal + agent tools/MCP, non-trivial policy layer |
| Grand — Design | Full operator loop: rules → queue → cockpit |
| Grand — Impact | SMB / agency paying contractors with guardrails |
| Grand — Innovation | Policy-bound autonomy vs generic shopping bots |
| Grand — Presentation | Single narrative in demo video |
| Best Use of Agentic Commerce | Approve-to-transact and capped auto-pay |
| Best Use of PayPal + AI | Tools/MCP as spine of the app |
| Best Use of AG Grid | AG Studio + stream + NL widget (not table-only) |

## Risk register

| Risk | Mitigation |
| --- | --- |
| AG Studio learning curve | Attend Oct 12 PayPal × AG Grid session; use partner boilerplate |
| MCP vs REST scope creep | Pick one primary integration; mirror guardrails on both if both exist |
| Sandbox webhook delays | Webhooks Simulator + polling fallback |
| Existing project rule | Document “created Oct 2026” and significant commits during submission period |

## Daily rhythm (suggested)

- **Morning:** One vertical slice (API + UI + test)
- **Afternoon:** Demo script rehearsal (30s increments)
- **End of day:** Update `PROGRESS.md` and note blockers
