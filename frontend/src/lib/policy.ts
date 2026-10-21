export type PolicyResult =
  | { allowed: true; capUsd: number }
  | { allowed: false; capUsd: number; reason: string };

export function getPolicyCapUsd(): number {
  const raw = process.env.CAPSTAN_MAX_PAYMENT_USD;
  const parsed = raw ? Number.parseFloat(raw) : 500;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 500;
}

export function evaluatePayment(amountUsd: number): PolicyResult {
  const capUsd = getPolicyCapUsd();

  if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
    return {
      allowed: false,
      capUsd,
      reason: "Amount must be greater than zero.",
    };
  }

  if (amountUsd > capUsd) {
    return {
      allowed: false,
      capUsd,
      reason: `This payment exceeds your policy cap of $${capUsd.toFixed(2)}.`,
    };
  }

  return { allowed: true, capUsd };
}
