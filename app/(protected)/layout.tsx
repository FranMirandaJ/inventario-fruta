import { ReactNode } from "react";
import { verifySession } from "@/lib/dal/auth";
import AppShell from "@/components/AppShell";
import CambiarPasswordForm from "./_components/CambiarPasswordForm";
import { capitalizeFirstLetter } from "@/lib/text";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await verifySession();

  if (session.debe_cambiar_password) {
    return <CambiarPasswordForm nombre={capitalizeFirstLetter(session.nombre.split(" ")[0])} />;
  }

  return <AppShell session={session}>{children}</AppShell>;
}
