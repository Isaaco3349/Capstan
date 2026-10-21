import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <BrandMark />
        <nav className="hidden items-center gap-8 text-sm text-text-muted md:flex">
          <a href="#how-it-works" className="transition-colors hover:text-text">
            How it works
          </a>
          <a href="#trust" className="transition-colors hover:text-text">
            Trust model
          </a>
        </nav>
        <Link
          href="/app"
          className="inline-flex h-9 items-center justify-center rounded-[var(--radius-sm)] bg-accent px-3.5 text-sm font-medium text-bg transition-colors hover:bg-accent-muted"
        >
          Open console
        </Link>
      </div>
    </header>
  );
}
