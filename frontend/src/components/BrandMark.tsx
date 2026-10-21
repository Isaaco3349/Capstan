import Link from "next/link";

export function BrandMark({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 rounded-md outline-offset-4"
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border-strong bg-surface-elevated shadow-[var(--shadow-card)] transition-colors group-hover:border-accent/40"
        aria-hidden
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="7"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-accent"
          />
          <path
            d="M12 5v14M8 8.5h8M8 15.5h8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-text-muted"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight text-text">
          Capstan
        </span>
        <span className="mt-0.5 text-[11px] font-medium text-text-faint">
          Payment control
        </span>
      </span>
    </Link>
  );
}
