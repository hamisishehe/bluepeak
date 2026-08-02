import { AppShell } from '@/components/app-shell';

export default function AdminConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell role="SUPER_ADMIN" title="Administration" roleLabel="Admin Console">{children}</AppShell>
  );
}
