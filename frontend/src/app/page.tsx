import { BrandMark } from "@/components/BrandMark";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

const FLOW = [
  {
    step: "01",
    title: "Draft",
    body: "Operator or AI proposes a contractor payout with milestone context.",
  },
  {
    step: "02",
    title: "Policy",
    body: "Caps and rules run before any PayPal API call is allowed.",
  },
  {
    step: "03",
    title: "Review",
    body: "Human confirms amount, payee, and description on a clear summary.",
  },
  {
    step: "04",
    title: "Transact",
    body: "PayPal sandbox checkout captures funds; every step hits the audit log.",
  },
];

export default function HomePage() {
  return (
    <>
      <MarketingHeader />
      <div className="mx-auto max-w-6xl px-6">
        <section className="grid gap-10 pb-20 pt-10 md:grid-cols-2 md:items-center md:gap-12 md:pb-24 md:pt-14 lg:gap-16 lg:pb-28 lg:pt-16">
          <div>
            <Badge tone="accent">PayPal, Policy, Audit</Badge>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-text sm:text-5xl">
              Controlled payouts for teams that pay on PayPal
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-muted">
              Capstan is the operator layer between your agency and PayPal. It
              runs policy checks, explicit approval, and sandbox checkout today,
              with AI drafted payments. Built for milestone contractor
              payouts, not unconstrained chatbots with a card on file.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/app"
                className="inline-flex h-11 items-center justify-center rounded-[var(--radius-sm)] bg-accent px-5 text-[15px] font-medium text-bg transition-colors hover:bg-accent-muted"
              >
                Open operator console
              </Link>
              <Link
                href="/app/dashboard"
                className="inline-flex h-11 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface px-5 text-[15px] font-medium text-text transition-colors hover:bg-surface-elevated"
              >
                Finance dashboard
              </Link>
              <a
                href="#how-it-works"
                className="text-[15px] font-medium text-text-muted transition-colors hover:text-text"
              >
                See the flow
              </a>
            </div>
          </div>

          <Card padding="lg" className="relative overflow-hidden">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent-subtle blur-3xl"
              aria-hidden
            />
            <p className="text-xs font-medium uppercase tracking-wide text-text-faint">
              Session preview
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-[var(--radius-md)] border border-border bg-bg/80 p-4">
                <p className="text-xs text-text-muted">Policy</p>
                <p className="mt-1 text-sm font-medium text-text">
                  Max payment $500.00 USD
                </p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-border bg-bg/80 p-4">
                <p className="text-xs text-text-muted">Review</p>
                <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">
                  $250.00
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  Alex Chen, homepage delivery
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Audit: policy passed, order created, captured
              </div>
            </div>
          </Card>
        </section>

        <section id="how-it-works" className="border-t border-border py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-text">
            How Capstan works
          </h2>
          <p className="mt-3 max-w-2xl text-text-muted">
            One pipeline for operators: no hidden automation, no payment
            without a recorded decision.
          </p>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FLOW.map((item) => (
              <li
                key={item.step}
                className="rounded-[var(--radius-lg)] border border-border bg-surface p-5"
              >
                <span className="font-mono text-xs font-medium text-accent">
                  {item.step}
                </span>
                <h3 className="mt-3 font-semibold text-text">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section id="trust" className="border-t border-border py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-text">
                Trust by design
              </h2>
              <p className="mt-3 text-text-muted leading-relaxed">
                Agentic commerce only works when operators can see what happened
                and why. Capstan logs policy blocks, approvals, and PayPal order
                lifecycle events in one timeline, built for compliance minded
                teams and finance operators.
              </p>
            </div>
            <ul className="space-y-4 text-sm text-text-muted">
              <li className="rounded-[var(--radius-md)] border border-border bg-surface p-4">
                <strong className="text-text">Sandbox first.</strong> Develop and
                demo without live funds.
              </li>
              <li className="rounded-[var(--radius-md)] border border-border bg-surface p-4">
                <strong className="text-text">Confirm before checkout.</strong> Two
                human checkpoints before the PayPal UI.
              </li>
              <li className="rounded-[var(--radius-md)] border border-border bg-surface p-4">
                <strong className="text-text">AG Grid cockpit.</strong> Filters,
                CSV export, and row inspection on every PayPal and policy event.
              </li>
            </ul>
          </div>
        </section>
      </div>

      <footer className="mt-8 border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
          <BrandMark />
          <p className="text-sm text-text-faint">
            Capstan. Policy bound PayPal operations. MIT license.
          </p>
        </div>
      </footer>
    </>
  );
}
