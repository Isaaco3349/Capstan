import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-bg hover:bg-accent-muted border border-transparent shadow-sm",
  secondary:
    "bg-surface-elevated text-text border border-border hover:bg-surface-hover hover:border-border-strong",
  ghost: "bg-transparent text-text-muted hover:text-text hover:bg-surface-elevated border border-transparent",
  danger:
    "bg-error-subtle text-error border border-error/30 hover:border-error/50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-[15px] gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-[var(--radius-sm)] font-medium transition-colors disabled:pointer-events-none disabled:opacity-45 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
