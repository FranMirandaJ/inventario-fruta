import "server-only";
import { prisma } from "@/lib/prisma";
import { cache } from "react";
import type { Categoria } from "@/generated/prisma";

export type CategoriaOption = Pick<Categoria, "id" | "nombre">;

export const obtenerOpcionesCategoriasProductos = cache(
  async (): Promise<CategoriaOption[]> => {
    return prisma.categoria.findMany({
      select: { id: true, nombre: true },
      orderBy: {
        nombre: "asc",
      },
    });
  },
);
