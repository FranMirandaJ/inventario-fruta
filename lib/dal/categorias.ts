import "server-only";
import { prisma } from "@/lib/prisma";
import { cache } from "react";
import type { Categoria } from "@/generated/prisma";

export type CategoriaOption = Pick<Categoria, "id" | "nombre">;


export type CategoriaStatsInicio = {
  id: number;
  nombre: string;
  total_stock: number;
  valor_inventario: number;
};

type CategoriaStatsRow = {
  id: number;
  nombre: string;
  total_stock: bigint;
  valor_inventario: number;
};

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

export const obtenerCategoriasStatsInicio = cache(async(): Promise<CategoriaStatsInicio[]> => {

  const categorias = await prisma.$queryRaw<CategoriaStatsRow[]>`
    SELECT 
      cat.id,
      cat.nombre,
      COALESCE(SUM(pr.stock_actual), 0) AS total_stock,
      COALESCE(SUM(pr.stock_actual * pr.precio), 0) AS valor_inventario
    FROM Categoria AS cat
    LEFT JOIN Producto AS pr
    ON pr.categoria_id = cat.id AND pr.activo = 1
    GROUP BY cat.id, cat.nombre
    ORDER BY cat.nombre ASC;
  `;

  return categorias.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    total_stock: Number(c.total_stock),
    valor_inventario: Number(c.valor_inventario),
  }));
});