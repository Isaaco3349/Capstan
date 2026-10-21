import type { PaymentDraftResult } from "./draft-payment";

export function fallbackDraftPayment(message: string): PaymentDraftResult {
  const amountMatch = message.match(/\$?\s*(\d+(?:\.\d{1,2})?)/);
  const amountUsd = amountMatch
    ? Number.parseFloat(amountMatch[1]).toFixed(2)
    : "";

  let payeeLabel = "";
  const payMatch = message.match(
    /pay\s+([^,$\n]+?)(?:\s*,|\s+for\s+|\s+\$|\s+\d)/i,
  );
  if (payMatch) {
    payeeLabel = payMatch[1].trim();
  } else {
    const toMatch = message.match(/to\s+([^,$\n]+?)(?:\s*,|\s+for\s+|\s+\$)/i);
    if (toMatch) payeeLabel = toMatch[1].trim();
  }

  let milestone = "";
  const forMatch = message.match(/\bfor\s+(?:the\s+)?(.+?)(?:\.|$)/i);
  if (forMatch) {
    milestone = forMatch[1].trim().replace(/\s+\$\d.*$/, "").trim();
  }

  const memo = milestone ? `Contractor payout: ${milestone}` : "Contractor payout";

  if (!payeeLabel || !amountUsd) {
    throw new Error(
      "Could not parse payee and amount. Example: Pay Alex, contractor, $50 for homepage delivery.",
    );
  }

  return {
    payeeLabel,
    amountUsd,
    milestone,
    memo,
    agentSummary: `Local agent parsed payee ${payeeLabel} and amount $${amountUsd} without OpenAI.`,
  };
}
