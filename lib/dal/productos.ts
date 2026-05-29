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

export type ProductoParaVenta = {
  id: number;
  nombre: string;
  categoria_nombre: string;
  stock_actual: number;
  stock_minimo: number;
  precio: number;
};

export const obtenerProductos = cache(async (): Promise<ProductoRow[]> => {
  const productos = await prisma.producto.findMany({
    include: {
      categoria: { select: { id: true, nombre: true } },
    },
    orderBy: [
      { activo: "desc" },               // Activos primero
      { categoria: { nombre: "asc" } }, // Luego agrupa por Categoría (A-Z)
      { nombre: "asc" }                 // Finalmente por Nombre (A-Z)
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

export const obtenerProductosActivosDisponibles = cache(async(): Promise<ProductoParaVenta[]> => {
  const productos = await prisma.producto.findMany({
    where: {
      AND: [
        { activo: true },
        { stock_actual: { gt : 0 } },
      ]
    },
    select: {
      id: true,
      nombre: true,
      stock_actual: true,
      stock_minimo: true,
      precio: true,
      categoria: { select: { nombre: true, } },
    },
    orderBy: [
      { categoria: { nombre: "asc" } },
      { nombre: "asc" },
    ],
  });

  return productos.map( (p) => ({
    id: p.id,
    nombre: p.nombre,
    categoria_nombre: p.categoria.nombre,
    stock_actual: p.stock_actual,
    stock_minimo: p.stock_minimo,
    precio: Number(p.precio),
  }));

});