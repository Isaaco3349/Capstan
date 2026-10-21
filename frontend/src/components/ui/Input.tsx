import type { InputHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-11 w-full rounded-[var(--radius-sm)] border border-border bg-bg px-3.5 text-[15px] text-text placeholder:text-text-faint transition-colors hover:border-border-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 ${className}`}
      {...props}
    />
  );
}

export function FieldLabel({
  children,
  htmlFor,
  hint,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  hint?: string;
}) {
  return (
    <div className="mb-2">
      <label
        htmlFor={htmlFor}
        className="block text-[13px] font-medium text-text"
      >
        {children}
      </label>
      {hint ? (
        <p className="mt-0.5 text-xs text-text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
