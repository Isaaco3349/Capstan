import { AppShell } from "@/components/layout/AppShell";
import { AuditGridDashboard } from "@/components/AuditGridDashboard";

export default function DashboardPage() {
  return (
    <AppShell>
      <AuditGridDashboard />
    </AppShell>
  );
}
