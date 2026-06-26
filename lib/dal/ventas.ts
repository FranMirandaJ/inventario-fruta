import "server-only";
import { prisma } from "@/lib/prisma";
import { EstadoVenta } from "@/generated/prisma";
import { cache } from "react";

export type VentaRow = {
    id: number,
    total: number,
    fecha: Date,
    vendedor: string,
    detalles: {
        id: number;
        cantidad: number;
        subtotal: number;
        producto_nombre: string;
        categoria: string;
    }[]
};

export const obtenerVentas = cache(async (): Promise<VentaRow[]> => {
    const ventas = await prisma.venta.findMany({
        where: { estado: EstadoVenta.ACTIVA },
        orderBy: { created_at: "desc" },
        select: {
            id: true,
            total: true,
            created_at: true,
            usuario: { select: { nombre: true } },
            detalles: {
                select: {
                    id: true,
                    cantidad: true,
                    producto: { select: { nombre: true, categoria: {select: { nombre: true } } } },
                    subtotal: true,
                }
            }
        }
    });
    return ventas.map(v => ({
        id: v.id,
        total: Number(v.total),
        fecha: v.created_at,
        vendedor: v.usuario.nombre,
        detalles: v.detalles.map(d => ({
            id: d.id,
            cantidad: d.cantidad,
            subtotal: Number(d.subtotal),
            producto_nombre: d.producto.nombre,
            categoria: d.producto.categoria.nombre,
        }))
    }));
});