import "server-only";
import { prisma } from "@/lib/prisma";
import { cache } from "react";
import type { Producto, Categoria } from "@/generated/prisma";

export type ProductoConCategoria = Producto & {
  categoria: Pick<Categoria, 'id' | 'nombre'>;
};

export const obtenerProductos = cache(async (): Promise<ProductoConCategoria[]> => {
    return prisma.producto.findMany({
        where: {activo: true},
        include: {
            categoria: {select: {id: true, nombre: true} }
        }
    });
});