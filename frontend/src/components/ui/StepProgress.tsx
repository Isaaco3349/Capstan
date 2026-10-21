export type StepId = "compose" | "review" | "checkout" | "done";

const STEPS: { id: StepId; label: string; description: string }[] = [
  { id: "compose", label: "Draft", description: "Payment details" },
  { id: "review", label: "Review", description: "Operator confirm" },
  { id: "checkout", label: "Checkout", description: "PayPal sandbox" },
  { id: "done", label: "Complete", description: "Captured" },
];

const order: StepId[] = ["compose", "review", "checkout", "done"];

function stepIndex(id: StepId): number {
  return order.indexOf(id);
}

export function StepProgress({ current }: { current: StepId }) {
  const currentIdx = stepIndex(current);

  return (
    <nav aria-label="Payment progress" className="w-full overflow-x-auto">
      <ol className="flex min-w-[min(100%,36rem)] items-start justify-between gap-2">
        {STEPS.map((step, idx) => {
          const done = idx < currentIdx;
          const active = step.id === current;
          const upcoming = idx > currentIdx;

          return (
            <li key={step.id} className="flex min-w-0 flex-1 flex-col items-center text-center">
              <div className="flex w-full items-center">
                {idx > 0 ? (
                  <div
                    className={`h-px flex-1 ${done || active ? "bg-accent/40" : "bg-border"}`}
                    aria-hidden
                  />
                ) : (
                  <div className="flex-1" aria-hidden />
                )}
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                    active
                      ? "border-accent bg-accent-subtle text-accent"
                      : done
                        ? "border-success/40 bg-success-subtle text-success"
                        : "border-border bg-surface-elevated text-text-faint"
                  }`}
                  aria-current={active ? "step" : undefined}
                >
                  {done ? "✓" : idx + 1}
                </span>
                {idx < STEPS.length - 1 ? (
                  <div
                    className={`h-px flex-1 ${done ? "bg-success/40" : "bg-border"}`}
                    aria-hidden
                  />
                ) : (
                  <div className="flex-1" aria-hidden />
                )}
              </div>
              <p
                className={`mt-2 text-xs font-medium sm:text-sm ${
                  upcoming ? "text-text-faint" : "text-text"
                }`}
              >
                {step.label}
              </p>
              <p className="mt-0.5 hidden text-[11px] text-text-muted sm:block">
                {step.description}
              </p>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
