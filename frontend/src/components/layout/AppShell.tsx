import { BrandMark } from "@/components/BrandMark";
import { SandboxBanner } from "@/components/SandboxBanner";
import { Badge } from "@/components/ui/Badge";
import { AppNav } from "./AppNav";
import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SandboxBanner />
      <header className="border-b border-border bg-surface/60 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
          <BrandMark href="/" />
          <div className="flex items-center gap-3">
            <AppNav />
            <Badge tone="warning">Sandbox</Badge>
            <Link
              href="/"
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              Home
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 lg:py-10">
        {children}
      </main>
    </div>
  );
}
