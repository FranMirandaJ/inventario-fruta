import { ReactNode } from "react";
import type { SessionPayload } from "@/lib/definitions";
import Navbar from "@/app/(protected)/_components/Navbar";
import Footer from "@/app/(protected)/_components/Footer";
import { SessionProvider } from "@/lib/contexts/session-context";

export default function AppShell({
  session,
  children,
}: {
  session: SessionPayload;
  children: ReactNode;
}) {
  return (
    <SessionProvider session={session}>
      <div className="min-h-screen flex flex-col">
        <Navbar/>
        <main className="grow">{children}</main>
        <Footer />
      </div>
    </SessionProvider>
  );
}
