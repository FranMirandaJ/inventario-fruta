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

type AlertaStockRow = {
  id: number;
  nombre: string;
  categoria_nombre: string;
  stock_actual: number;
  stock_minimo: number;
};

export type AlertaStockResult = {
  alertas: AlertaStockRow[];
  total_alertas: number;
};

type TotalAlertasRow = {
  total: bigint;
};

type ProductoMasVendidoRow = {
  id: number;
  nombre: string;
  total_vendido: bigint;
};

export type ProductoMasVendido = {
  id: number;
  nombre: string;
  total_vendido: number;
}

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

export const obtenerAlertasStock = cache(async (limite = 5): Promise<AlertaStockResult> => {
  const [alertas, [{ total }]] = await Promise.all([
    prisma.$queryRaw<AlertaStockRow[]>`
      SELECT
        p.id,
        p.nombre,
        c.nombre AS categoria_nombre,
        p.stock_actual,
        p.stock_minimo
      FROM Producto AS p
      INNER JOIN Categoria AS c
      ON c.id = p.categoria_id
      WHERE p.activo = 1 AND p.stock_actual <= p.stock_minimo
      ORDER BY p.stock_actual ASC, p.nombre ASC
      LIMIT ${limite}
    `,
    prisma.$queryRaw<TotalAlertasRow[]>`
      SELECT COUNT(*) AS total
      FROM Producto AS p
      WHERE p.activo = 1 AND p.stock_actual <= p.stock_minimo
    `,
  ]);

  return {
    alertas,
    total_alertas: Number(total),
  };
});

export const obtenerNProductosMasVendidos = cache(async(n = 5): Promise<ProductoMasVendido[]> => {
  const productos = await prisma.$queryRaw<ProductoMasVendidoRow[]>`
    SELECT
      dv.producto_id AS id,
      p.nombre,
      SUM(dv.cantidad) AS total_vendido
    FROM Producto AS p
    INNER JOIN DetalleVenta AS dv ON p.id = dv.producto_id
    INNER JOIN Venta AS v ON v.id = dv.venta_id
    WHERE v.estado = 'ACTIVA' AND p.activo = 1
    GROUP BY dv.producto_id, p.nombre
    ORDER BY total_vendido DESC, p.nombre ASC
    LIMIT ${n}
  `;

  return productos.map(({total_vendido, ...p}) => ({
    ...p,
    total_vendido: Number(total_vendido)
  }));
});