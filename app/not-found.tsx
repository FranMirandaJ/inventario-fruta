import { verifySession } from "@/lib/dal/auth";
import AppShell from "@/components/AppShell";
import NotFoundContent from "@/components/NotFoundContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error 404",
};

export default async function NotFound() {
  const session = await verifySession();

  return (
    <AppShell session={session}>
      <NotFoundContent />
    </AppShell>
  );
}
