import { ReactNode } from "react";
import Image from "next/image";
import { verifySession } from "@/lib/dal/auth";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await verifySession();

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gray-50">
        <Image
          src="/fondo.jpg"
          alt="Background"
          fill
          priority
          className="object-cover opacity-40"
        />
      </div>

      <div className="min-h-screen flex flex-col">
        <Navbar sessionData={session} />

        <main className="grow">{children}</main>

        <Footer />
      </div>
    </>
  );
}
