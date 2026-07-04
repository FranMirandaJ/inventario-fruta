import "server-only";
import { prisma } from "@/lib/prisma";
import { EstadoVenta } from "@/generated/prisma";
import { cache } from "react";
import { dateFromLocal } from "@/lib/date";

export type VentaRow = {
    id: number,
    total: number,
    fecha: Date,
    vendedor: string,
    detalles: {
        id: number;
        cantidad: number;
        precio_unitario: number;
        subtotal: number;
        producto_nombre: string;
        categoria: string;
    }[]
};

export type ObtenerVentasParams = {
    q?: string;
    page?: number;
    pageSize?: number;
    desde?: string;
    hasta?: string;
    offset?: string;
};

export type ObtenerVentasResult = {
    ventas: VentaRow[];
    totalPages: number;
    total: number;
};

export const obtenerVentas = cache(async (params?: ObtenerVentasParams): Promise<ObtenerVentasResult> => {
    const { q, page = 1, pageSize = 10, desde, hasta, offset } = params ?? {};
    const offsetMin = Number(offset) || 0;

    const where = {
        estado: EstadoVenta.ACTIVA,
        ...(q && {
            usuario: { nombre: { contains: q } } 
        }),
        ...((desde || hasta) ? {
            created_at: {
                ...(desde && { gte: dateFromLocal(desde, offsetMin) }),
                ...(hasta && { lte: dateFromLocal(hasta, offsetMin, true) }),
            },
        } : {}),
    };

    const [ventas, total] = await Promise.all([
        prisma.venta.findMany({
            where,
            orderBy: { created_at: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: {
                id: true,
                total: true,
                created_at: true,
                usuario: { select: { nombre: true } },
                detalles: {
                    select: {
                        id: true,
                        cantidad: true,
                        precio_unitario: true,
                        producto: { select: { nombre: true, categoria: { select: { nombre: true } } } },
                        subtotal: true,
                    }
                }
            }
        }),
        prisma.venta.count({ where }),
    ]);

    return {
        ventas: ventas.map(v => ({
            id: v.id,
            total: Number(v.total),
            fecha: v.created_at,
            vendedor: v.usuario.nombre,
            detalles: v.detalles.map(d => ({
                id: d.id,
                cantidad: d.cantidad,
                precio_unitario: Number(d.precio_unitario),
                subtotal: Number(d.subtotal),
                producto_nombre: d.producto.nombre,
                categoria: d.producto.categoria.nombre,
            }))
        })),
        totalPages: Math.ceil(total / pageSize),
        total,
    };
});