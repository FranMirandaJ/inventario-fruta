import { ReactNode } from "react";
import Image from "next/image"; // Asegúrate de tener esta importación
import { verifySession } from "@/lib/dal/auth";
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
    <>
      <div className="fixed inset-0 -z-10 bg-gray-50"> 
        <Image
          src="/fondo.jpg"
          alt="Background"
          fill
          priority
          className="object-cover opacity-40" // object-cover asegura que no se deforme
        />
      </div>

      <div className="min-h-screen flex flex-col">
        <DashboardNavbar sessionData={session} />

        <main className="grow">
          {children}
        </main>
        
        <DashboardFooter />
      </div>
    </>
  );
}