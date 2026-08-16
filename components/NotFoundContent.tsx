import Link from "next/link";
import { IceCreamCone, Cherry, GlassWater, Snowflake } from "lucide-react";
import ContenedorPagina from "@/components/ContenedorPagina";
import { Button } from "@/components/ui/button";

export default function NotFoundContent() {
  return (
    <ContenedorPagina>
      <div className="flex flex-col items-center justify-center text-center gap-6 py-12 animate-in fade-in-0 duration-500 motion-reduce:animate-none sm:py-20">

        <div className="flex flex-col items-center gap-2">
          <h2 className="font-bold text-3xl text-primary tracking-wide">
            Error
          </h2>
          <h1 className="text-6xl font-extrabold text-foreground tracking-wide sm:text-7xl">
            404
          </h1>
          <p className="text-muted-foreground max-w-md text-xl">
            La página que buscas no existe o fue movida. Verifica la URL o
            regresa al inicio.
          </p>
        </div>

        <Button asChild size="lg" className="h-12 px-8 text-base sm:text-lg">
          <Link href="/dashboard">Volver al inicio</Link>
        </Button>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 sm:gap-5">
          <span
            className="flex size-12 animate-bounce items-center justify-center rounded-full bg-pink-100 text-pink-600 motion-reduce:animate-none sm:size-16 dark:bg-pink-500/15 dark:text-pink-300"
            style={{ animationDelay: "0ms" }}
          >
            <IceCreamCone className="size-7 sm:size-9" />
          </span>
          <span
            className="flex size-12 animate-bounce items-center justify-center rounded-full bg-red-100 text-red-600 motion-reduce:animate-none sm:size-16 dark:bg-red-500/15 dark:text-red-300"
            style={{ animationDelay: "150ms" }}
          >
            <Cherry className="size-7 sm:size-9" />
          </span>
          <span
            className="flex size-12 animate-bounce items-center justify-center rounded-full bg-amber-100 text-amber-600 motion-reduce:animate-none sm:size-16 dark:bg-amber-500/15 dark:text-amber-300"
            style={{ animationDelay: "300ms" }}
          >
            <GlassWater className="size-7 sm:size-9" />
          </span>
          <span
            className="flex size-12 animate-bounce items-center justify-center rounded-full bg-sky-100 text-sky-600 motion-reduce:animate-none sm:size-16 dark:bg-sky-500/15 dark:text-sky-300"
            style={{ animationDelay: "450ms" }}
          >
            <Snowflake className="size-7 sm:size-9" />
          </span>
        </div>
      </div>
    </ContenedorPagina>
  );
}
