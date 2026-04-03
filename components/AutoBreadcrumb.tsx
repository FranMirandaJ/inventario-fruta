"use client";

import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// DICCIONARIO DE RUTAS
// Aquí se traduce cómo se llama la carpeta en la URL a cómo se quiere que lo lea el usuario.
const nombresRutas: Record<string, string> = {
  dashboard: "Inicio",
  catalogos: "Catálogos",
  ventas: "Ventas",
};

export default function AutoBreadcrumb() {
  const pathname = usePathname(); // Ej: "/dashboard/catalogos/productos"

  // Rompemos la URL en pedazos y quitamos los espacios vacíos
  // Ej: ["dashboard", "catalogos", "productos"]
  const segmentos = pathname.split("/").filter((segmento) => segmento !== "");

  // Si estamos en la raíz no mostramos nada
  if (segmentos.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segmentos.map((segmento, index) => {
          // Construimos la URL acumulada para el enlace (href)
          // Si estamos en "catalogos" (index 1), el enlace será "/dashboard/catalogos"
          const href = "/" + segmentos.slice(0, index + 1).join("/");

          const esUltimo = index === segmentos.length - 1;

          let etiqueta =
            nombresRutas[segmento] ||
            segmento.charAt(0).toUpperCase() +
              segmento.slice(1).replace(/-/g, " ");

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {esUltimo ? (
                  <BreadcrumbPage>{etiqueta}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{etiqueta}</BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!esUltimo && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
