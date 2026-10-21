type Tone = "neutral" | "accent" | "success" | "warning" | "error";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-elevated text-text-muted border-border",
  accent: "bg-accent-subtle text-accent border-accent/25",
  success: "bg-success-subtle text-success border-success/25",
  warning: "bg-warning-subtle text-warning border-warning/25",
  error: "bg-error-subtle text-error border-error/25",
};

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
