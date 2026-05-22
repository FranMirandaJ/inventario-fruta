import "server-only";
import { prisma } from "@/lib/prisma";
import { cache } from "react";
import type { Prisma } from "@/generated/prisma";

export type ProductoConCategoria = Prisma.ProductoGetPayload<{
  include: { categoria: { select: { id: true; nombre: true } } }
}>;

export const obtenerProductos = cache(async (): Promise<ProductoConCategoria[]> => {
    return prisma.producto.findMany({
        where: {activo: true},
        include: {
            categoria: {select: {id: true, nombre: true} }
        }
    });
});
