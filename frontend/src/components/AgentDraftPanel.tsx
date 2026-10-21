"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Card, CardHeader } from "./ui/Card";

export type AgentDraft = {
  payeeLabel: string;
  amountUsd: string;
  milestone: string;
  memo: string;
};

export function AgentDraftPanel({
  onApplied,
  onAudit,
}: {
  onApplied: (draft: AgentDraft) => void;
  onAudit: () => void;
}) {
  const [message, setMessage] = useState(
    "Pay Elvis, contractor lead, $50 for the landing page milestone.",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedLine, setAppliedLine] = useState<string | null>(null);

  const run = async () => {
    setError(null);
    setAppliedLine(null);
    setLoading(true);
    try {
      const res = await fetch("/api/agent/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Draft failed");
      }
      const draft = data.draft as AgentDraft;
      const mode = (data.mode as string) ?? "local";
      onApplied(draft);
      onAudit();
      setAppliedLine(
        `Applied to the form below: ${draft.payeeLabel}, $${draft.amountUsd} (${mode === "openai" ? "OpenAI" : "local parser"}).`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Draft failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card padding="md" className="border-accent/20 bg-accent-subtle/30">
      <CardHeader
        title="Agent draft"
        description="Describe the payout in plain language. Uses a free local parser by default. Add OPENAI_API_KEY for full LLM parsing. You still review before PayPal."
      />
      <textarea
        className="min-h-[100px] w-full resize-y rounded-[var(--radius-sm)] border border-border bg-bg px-3.5 py-3 text-[15px] text-text placeholder:text-text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        aria-label="Payment instruction for agent"
      />
      {appliedLine ? (
        <p className="mt-3 text-sm text-success" role="status">
          {appliedLine}
        </p>
      ) : null}
      {error ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-4 flex justify-end">
        <Button onClick={() => void run()} disabled={loading || !message.trim()}>
          {loading ? "Drafting…" : "Draft with AI"}
        </Button>
      </div>
    </Card>
  );
}
