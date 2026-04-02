import { verifySession } from "@/lib/dal/auth";
import { ReactNode } from "react";
import DashboardNavbar from "./_components/DashboardNavbar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {

    // Datos de sesión del usuario
    const session = await verifySession();

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNavbar />
      <main className="grow bg-gray-50">{children}</main>
    </div>
  );
}
