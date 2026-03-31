import { requireSessionUserId } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireSessionUserId();
  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  );
}
