import { ReactNode } from "react";
import { verifySession } from "@/lib/dal/auth";
import AppShell from "@/components/AppShell";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await verifySession();

  return <AppShell session={session}>{children}</AppShell>;
}
