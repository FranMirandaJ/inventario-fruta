import "server-only";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export type ProductoRow = {
  id: number;
  nombre: string;
  precio: number;
  stock_actual: number;
  stock_minimo: number;
  categoria_id: number;
  categoria_nombre: string;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
};

export const obtenerProductos = cache(async (): Promise<ProductoRow[]> => {
  const productos = await prisma.producto.findMany({
    //where: { activo: true },
    include: {
      categoria: { select: { id: true, nombre: true } },
    },
    orderBy: [
      { categoria: { nombre: "asc" } }, // Primero agrupa por Categoría (A-Z)
      { nombre: "asc" }                 // Luego por Nombre del producto (A-Z)
    ]
  });

  return productos.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    precio: Number(p.precio),
    stock_actual: p.stock_actual,
    stock_minimo: p.stock_minimo,
    categoria_id: p.categoria_id,
    categoria_nombre: p.categoria.nombre,
    activo: p.activo,
    created_at: p.created_at,
    updated_at: p.updated_at,
  }));
});
