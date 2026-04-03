import { verifySession } from "@/lib/dal/auth";
import { ReactNode } from "react";
import DashboardNavbar from "./_components/DashboardNavbar";
import DashboardFooter from "./_components/DashboardFooter";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {

    // Datos de sesión del usuario
    const session = await verifySession();

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNavbar sessionData={session}/>
      <main className="grow bg-gray-50">{children}</main>
      <DashboardFooter/>
    </div>
  );
}
