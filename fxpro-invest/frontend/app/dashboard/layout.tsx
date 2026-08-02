import { AppShell } from '@/components/app-shell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell role="USER" title="Investor Dashboard" roleLabel="Investor Portal">{children}</AppShell>
  );
}
