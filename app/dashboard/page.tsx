import { verifySession } from "@/lib/dal/auth";

export default async function DashboardPage() {
  const session = await verifySession();
  console.log(session);

  return (
    <>
      Dashboard Page
      <div>Bienvenido {session.nombre}!</div>
    </>
  );
}
