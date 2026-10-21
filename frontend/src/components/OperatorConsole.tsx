"use client";

import {
  PayPalButtons,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";
import { useCallback, useEffect, useState } from "react";
import { AuditFeed } from "./AuditFeed";
import { Button } from "./ui/Button";
import { Card, CardHeader } from "./ui/Card";
import { FieldLabel, Input } from "./ui/Input";
import { Badge } from "./ui/Badge";
import { StepProgress, type StepId } from "./ui/StepProgress";
import { AgentDraftPanel } from "./AgentDraftPanel";
import { appendAuditMirror } from "@/lib/audit-client-mirror";

type Draft = {
  payeeLabel: string;
  amountUsd: string;
  milestone: string;
  memo: string;
};

const initialDraft: Draft = {
  payeeLabel: "",
  amountUsd: "",
  milestone: "",
  memo: "",
};

export function OperatorConsole({ clientId }: { clientId: string }) {
  const [step, setStep] = useState<StepId>("compose");
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [capUsd, setCapUsd] = useState(500);
  const [policyError, setPolicyError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastCapture, setLastCapture] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [draftSource, setDraftSource] = useState<"manual" | "agent">("manual");

  useEffect(() => {
    fetch("/api/policy")
      .then((r) => r.json())
      .then((d: { capUsd: number }) => setCapUsd(d.capUsd))
      .catch(() => undefined);
  }, []);

  const bumpAudit = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (step === "done") {
      bumpAudit();
    }
  }, [step, bumpAudit]);

  const onReview = async () => {
    setPolicyError(null);
    const amount = Number.parseFloat(draft.amountUsd);
    const res = await fetch("/api/policy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountUsd: amount }),
    });
    const policy = (await res.json()) as {
      allowed: boolean;
      reason?: string;
    };
    if (!policy.allowed) {
      setPolicyError(policy.reason ?? "Blocked by policy.");
      appendAuditMirror({
        type: "policy.blocked",
        summary: policy.reason ?? "Blocked by policy.",
        meta: { amountUsd: amount },
      });
      bumpAudit();
      return;
    }
    if (!draft.payeeLabel.trim()) {
      setPolicyError("Enter who this payment is for.");
      return;
    }
    setStep("review");
  };

  const description =
    draft.memo.trim() ||
    `Payment to ${draft.payeeLabel}${draft.milestone ? `: ${draft.milestone}` : ""}`;

  const amountFormatted = Number.isFinite(Number.parseFloat(draft.amountUsd))
    ? Number.parseFloat(draft.amountUsd).toFixed(2)
    : "0.00";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
      <div className="space-y-8">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-[28px]">
              New contractor payment
            </h1>
            <Badge tone={draftSource === "agent" ? "accent" : "neutral"}>
              {draftSource === "agent" ? "AI draft" : "Manual draft"}
            </Badge>
          </div>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-muted">
            The agent proposes payouts from natural language. Policy runs before
            checkout. You confirm every payment before PayPal executes.
          </p>
        </div>

        <Card padding="md" className="bg-surface/80">
          <StepProgress current={step} />
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border bg-surface-elevated/80 px-4 py-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-faint">
              Policy
            </p>
            <p className="mt-0.5 text-sm text-text">
              Max single payment{" "}
              <span className="font-semibold tabular-nums text-accent">
                ${capUsd.toFixed(2)} USD
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="max-w-[14rem] text-xs leading-snug text-text-muted">
              Amounts above the cap never reach PayPal checkout.
            </p>
            {step === "compose" ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDraftSource("manual");
                  setDraft((d) => ({
                    ...d,
                    payeeLabel: d.payeeLabel || "Demo over cap",
                    amountUsd: String(Math.round(capUsd + 250)),
                    milestone: d.milestone || "Policy demo (blocked before PayPal)",
                  }));
                  setPolicyError(null);
                }}
              >
                Try policy block
              </Button>
            ) : null}
          </div>
        </div>

        {step === "compose" && (
          <>
            <AgentDraftPanel
              onAudit={bumpAudit}
              onApplied={(d) => {
                setDraft({
                  payeeLabel: d.payeeLabel,
                  amountUsd: d.amountUsd,
                  milestone: d.milestone,
                  memo: d.memo,
                });
                setDraftSource("agent");
                setPolicyError(null);
              }}
            />
          <Card padding="lg">
            <CardHeader
              title="Payment details"
              description="Edit fields if needed, then continue to review."
            />
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                void onReview();
              }}
            >
              <div>
                <FieldLabel htmlFor="payee" hint="Display name for your records and audit log.">
                  Payee
                </FieldLabel>
                <Input
                  id="payee"
                  placeholder="Alex Chen, design contractor"
                  value={draft.payeeLabel}
                  onChange={(e) => {
                    setDraftSource("manual");
                    setDraft((d) => ({ ...d, payeeLabel: e.target.value }));
                  }}
                />
              </div>
              <div>
                <FieldLabel htmlFor="amount" hint="Sandbox USD only.">
                  Amount
                </FieldLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-text-muted">
                    $
                  </span>
                  <Input
                    id="amount"
                    className="pl-8 font-mono tabular-nums"
                    placeholder="250.00"
                    inputMode="decimal"
                    value={draft.amountUsd}
                    onChange={(e) => {
                      setDraftSource("manual");
                      setDraft((d) => ({ ...d, amountUsd: e.target.value }));
                    }}
                  />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="milestone">Milestone / work completed</FieldLabel>
                <Input
                  id="milestone"
                  placeholder="Homepage redesign, final delivery"
                  value={draft.milestone}
                  onChange={(e) => {
                    setDraftSource("manual");
                    setDraft((d) => ({ ...d, milestone: e.target.value }));
                  }}
                />
              </div>
              <div>
                <FieldLabel htmlFor="memo" hint="Shown on the PayPal order when set.">
                  Memo <span className="font-normal text-text-faint">(optional)</span>
                </FieldLabel>
                <Input
                  id="memo"
                  placeholder="March 2026 contractor payout"
                  value={draft.memo}
                  onChange={(e) => {
                    setDraftSource("manual");
                    setDraft((d) => ({ ...d, memo: e.target.value }));
                  }}
                />
              </div>
              {policyError ? (
                <div
                  className="rounded-[var(--radius-sm)] border border-error/30 bg-error-subtle px-4 py-3 text-sm text-error"
                  role="alert"
                >
                  {policyError}
                </div>
              ) : null}
              <div className="flex justify-end pt-2">
                <Button type="submit" size="lg">
                  Continue to review
                </Button>
              </div>
            </form>
          </Card>
          </>
        )}

        {step === "review" && (
          <Card padding="lg">
            <CardHeader
              title="Operator review"
              description="Confirm the payout summary. Nothing is sent to PayPal until the next step."
            />
            <div className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg/60">
              <div className="border-b border-border bg-surface-elevated px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-text-faint">
                  Payout summary
                </p>
                <p className="mt-2 font-mono text-3xl font-semibold tabular-nums tracking-tight text-text">
                  ${amountFormatted}
                  <span className="ml-2 text-base font-normal text-text-muted">
                    USD
                  </span>
                </p>
              </div>
              <dl className="divide-y divide-border px-5 text-sm">
                <div className="grid grid-cols-[8rem_1fr] gap-4 py-3.5">
                  <dt className="text-text-muted">Payee</dt>
                  <dd className="font-medium text-text">{draft.payeeLabel}</dd>
                </div>
                <div className="grid grid-cols-[8rem_1fr] gap-4 py-3.5">
                  <dt className="text-text-muted">Milestone</dt>
                  <dd>{draft.milestone || "None"}</dd>
                </div>
                <div className="grid grid-cols-[8rem_1fr] gap-4 py-3.5">
                  <dt className="text-text-muted">PayPal description</dt>
                  <dd className="text-text-muted">{description}</dd>
                </div>
                <div className="grid grid-cols-[8rem_1fr] gap-4 py-3.5">
                  <dt className="text-text-muted">Policy</dt>
                  <dd className="text-success">Within ${capUsd.toFixed(2)} cap</dd>
                </div>
              </dl>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button variant="secondary" onClick={() => setStep("compose")}>
                Edit details
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  setCheckoutError(null);
                  setStep("checkout");
                }}
              >
                Continue to PayPal
              </Button>
            </div>
          </Card>
        )}

        {step === "checkout" && (
          <Card padding="lg">
            <CardHeader
              title="PayPal checkout"
              description="Complete payment with your sandbox buyer account. Funds are for testing only."
            />
            <div className="mb-5 rounded-[var(--radius-sm)] border border-border bg-surface-elevated/60 px-4 py-3 text-sm text-text-muted">
              <p className="font-medium text-text">Use sandbox login, not guest checkout</p>
              <p className="mt-1 leading-relaxed">
                In the PayPal window, choose <strong>Log in</strong> and use your
                sandbox <strong>Personal (buyer)</strong> email and password from
                Developer Dashboard → Sandbox Accounts. Do not fill the guest card
                form with your real email, phone, card, address, password, or date
                of birth.
              </p>
            </div>
            <div className="mx-auto max-w-md rounded-[var(--radius-md)] border border-border bg-bg/50 p-5">
              <PayPalScriptProvider
                options={{
                  clientId,
                  currency: "USD",
                  intent: "capture",
                  dataNamespace: "paypal_sdk",
                  components: "buttons",
                  disableFunding: "card,credit,paylater,venmo",
                }}
              >
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "silver",
                    shape: "rect",
                    label: "paypal",
                    height: 44,
                  }}
                  createOrder={async () => {
                    setCheckoutError(null);
                    const res = await fetch("/api/paypal/create-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        amountUsd: amountFormatted,
                        description,
                        payeeLabel: draft.payeeLabel,
                        milestone: draft.milestone,
                      }),
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      throw new Error(data.error ?? "Create order failed");
                    }
                    appendAuditMirror({
                      type: "payment.approved",
                      summary: `Operator approved ${draft.payeeLabel} for $${amountFormatted}`,
                      meta: {
                        payee: draft.payeeLabel,
                        amountUsd: amountFormatted,
                        milestone: draft.milestone,
                        orderId: data.id as string,
                      },
                    });
                    appendAuditMirror({
                      type: "paypal.order_created",
                      summary: `PayPal order ${data.id} created (${data.status ?? "CREATED"})`,
                      meta: { orderId: data.id as string, amountUsd: amountFormatted },
                    });
                    bumpAudit();
                    return data.id as string;
                  }}
                  onApprove={async (data) => {
                    const res = await fetch("/api/paypal/capture-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        orderId: data.orderID,
                        amountUsd: amountFormatted,
                        payeeLabel: draft.payeeLabel,
                      }),
                    });
                    const captured = await res.json();
                    if (!res.ok) {
                      throw new Error(captured.error ?? "Capture failed");
                    }
                    appendAuditMirror({
                      type: "paypal.captured",
                      summary: `Captured order ${captured.id} (${captured.status ?? "COMPLETED"})`,
                      meta: {
                        orderId: captured.id as string,
                        captureId: captured.captureId as string | undefined,
                        amountUsd: amountFormatted,
                        payee: draft.payeeLabel,
                      },
                    });
                    setLastCapture(captured.captureId ?? captured.id);
                    setStep("done");
                    setTimeout(() => bumpAudit(), 100);
                  }}
                  onError={(err) => {
                    console.error(err);
                    setCheckoutError(
                      "PayPal closed with an error. Often this is PAYEE_ACCOUNT_RESTRICTION: the Business sandbox linked to your app cannot receive this payment (country or account type). Use a US Business sandbox on the app and a US Personal buyer. Try Incognito with extensions off.",
                    );
                    bumpAudit();
                  }}
                />
              </PayPalScriptProvider>
            </div>
            {checkoutError ? (
              <p
                className="mx-auto mt-4 max-w-md rounded-[var(--radius-sm)] border border-error/30 bg-error-subtle px-4 py-3 text-sm text-error"
                role="alert"
              >
                {checkoutError}
              </p>
            ) : null}
            <div className="mt-6 text-center">
              <button
                type="button"
                className="text-sm text-text-muted underline-offset-4 hover:text-text hover:underline"
                onClick={() => setStep("review")}
              >
                Back to review
              </button>
            </div>
          </Card>
        )}

        {step === "done" && (
          <Card padding="lg" className="border-success/30">
            <div className="flex flex-col items-center py-4 text-center sm:py-6">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-subtle text-2xl text-success">
                ✓
              </span>
              <h2 className="mt-5 text-xl font-semibold text-text">
                Payment captured
              </h2>
              <p className="mt-2 max-w-md text-sm text-text-muted">
                Sandbox transaction completed. Check the audit trail for order and
                capture identifiers.
              </p>
              {lastCapture ? (
                <p className="mt-4 rounded-[var(--radius-sm)] border border-border bg-bg px-3 py-2 font-mono text-xs text-text-muted">
                  capture_id: {lastCapture}
                </p>
              ) : null}
              <Button
                className="mt-8"
                size="lg"
                onClick={() => {
                  setDraft(initialDraft);
                  setDraftSource("manual");
                  setStep("compose");
                  setLastCapture(null);
                  bumpAudit();
                }}
              >
                Create another payment
              </Button>
            </div>
          </Card>
        )}
      </div>

      <aside className="lg:pt-[52px]">
        <AuditFeed refreshKey={refreshKey} />
      </aside>
    </div>
  );
}
