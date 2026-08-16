import { ReactNode } from "react";
import type { SessionPayload } from "@/lib/definitions";
import Navbar from "@/app/(protected)/_components/Navbar";
import Footer from "@/app/(protected)/_components/Footer";

export default function AppShell({
  session,
  children,
}: {
  session: SessionPayload;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar sessionData={session} />

      <main className="grow">{children}</main>

      <Footer />
    </div>
  );
}
