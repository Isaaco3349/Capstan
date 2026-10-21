export function Card({
  children,
  className = "",
  padding = "md",
}: {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}) {
  const pad =
    padding === "none"
      ? ""
      : padding === "sm"
        ? "p-4"
        : padding === "lg"
          ? "p-8"
          : "p-6";

  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-card)] ${pad} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-text">
          {title}
        </h2>
        {description ? (
          <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
