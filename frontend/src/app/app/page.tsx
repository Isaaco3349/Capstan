import { AppShell } from "@/components/layout/AppShell";
import { OperatorConsole } from "@/components/OperatorConsole";
import { getPublicPayPalClientId } from "@/lib/paypal/config";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
export default function AppPage() {
  let clientId: string;
  try {
    clientId = getPublicPayPalClientId();
  } catch {
    return (
      <AppShell>
        <Card padding="lg" className="mx-auto max-w-lg text-center">
          <CardHeader
            title="Connect PayPal sandbox"
            description="Add your sandbox credentials to run the operator console locally."
          />
          <ol className="mt-2 space-y-2 text-left text-sm text-text-muted">
            <li>
              1. Copy <code className="text-text">../.env.example</code> to{" "}
              <code className="text-text">frontend/.env.local</code>
            </li>
            <li>
              2. Set{" "}
              <code className="font-mono text-xs text-text">
                NEXT_PUBLIC_PAYPAL_CLIENT_ID
              </code>
              ,{" "}
              <code className="font-mono text-xs text-text">PAYPAL_CLIENT_ID</code>
              , and{" "}
              <code className="font-mono text-xs text-text">
                PAYPAL_CLIENT_SECRET
              </code>
            </li>
            <li>3. Restart <code className="text-text">npm run dev</code></li>
          </ol>
          <Link
            href="/"
            className="mt-8 inline-flex h-10 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface-elevated px-4 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
          >
            Back to home
          </Link>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <OperatorConsole clientId={clientId} />
    </AppShell>
  );
}
