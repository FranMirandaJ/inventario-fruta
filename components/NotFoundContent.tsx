import Link from "next/link";
import ContenedorPagina from "@/components/ContenedorPagina";
import { Button } from "@/components/ui/button";

export default function NotFoundContent() {
  return (
    <ContenedorPagina>
      <div className="flex flex-col items-center justify-center text-center gap-6 py-16">

        <div className="flex flex-col items-center gap-2">
          <h2 className="font-semibold text-xl text-primary tracking-wide">
            Error
          </h2>
          <h1 className="text-6xl font-extrabold text-foreground tracking-wide">
            404
          </h1>
          <p className="text-muted-foreground max-w-md">
            La página que buscas no existe o fue movida. Verifica la URL o
            regresa al inicio.
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard">Volver al inicio</Link>
        </Button>
      </div>
    </ContenedorPagina>
  );
}
