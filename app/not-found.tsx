import { verifySession } from "@/lib/dal/auth";
import AppShell from "@/components/AppShell";
import NotFoundContent from "@/components/NotFoundContent";

export default async function NotFound() {
  const session = await verifySession();

  return (
    <AppShell session={session}>
      <NotFoundContent />
    </AppShell>
  );
}
