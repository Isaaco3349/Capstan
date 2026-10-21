import { fallbackDraftPayment } from "./fallback-draft";

export type PaymentDraftResult = {
  payeeLabel: string;
  amountUsd: string;
  milestone: string;
  memo: string;
  agentSummary: string;
};

const SYSTEM = `You extract a single contractor payout from the user message for a PayPal sandbox demo.
Return JSON only with keys: payeeLabel, amountUsd, milestone, memo, agentSummary.
amountUsd must be a decimal string with two digits (example "250.00").
payeeLabel is a display name (example "Alex Chen, design contractor").
milestone describes work completed.
memo is optional short text for PayPal description.
agentSummary is one sentence explaining what you parsed.`;

export type DraftMode = "openai" | "local";

export async function draftPaymentFromText(
  message: string,
): Promise<PaymentDraftResult & { mode: DraftMode }> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    return { ...fallbackDraftPayment(message), mode: "local" };
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: message },
      ],
    }),
  });

  const data = (await res.json()) as {
    error?: { message?: string };
    choices?: { message?: { content?: string } }[];
  };

  if (!res.ok) {
    throw new Error(data.error?.message ?? "OpenAI request failed");
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from AI");
  }

  const parsed = JSON.parse(content) as PaymentDraftResult;

  if (!parsed.payeeLabel?.trim() || !parsed.amountUsd?.trim()) {
    throw new Error("AI could not extract payee and amount. Try a clearer message.");
  }

  const amount = Number.parseFloat(parsed.amountUsd);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("AI returned an invalid amount.");
  }

  return {
    payeeLabel: parsed.payeeLabel.trim(),
    amountUsd: amount.toFixed(2),
    milestone: (parsed.milestone ?? "").trim(),
    memo: (parsed.memo ?? "").trim(),
    agentSummary: (parsed.agentSummary ?? "Agent drafted a payment proposal.").trim(),
    mode: "openai",
  };
}
