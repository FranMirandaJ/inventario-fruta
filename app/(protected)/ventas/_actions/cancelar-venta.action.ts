"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { EstadoVenta, TipoMovimiento } from "@/generated/prisma";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/client";
import { verifySession } from "@/lib/dal/auth";
import { createLogger } from "@/lib/logger";
import { FormState } from "@/lib/form-state";
import z from "zod";

const log = createLogger("Ventas/Cancelar");

export const cancelarVenta = async (id_venta: number): Promise<FormState> => {
  const usuario = await verifySession();
  const id_usuario = Number(usuario.id_usuario);

  const schemaId = z.coerce
    .number("Venta no válida.")
    .int("Venta no válida.")
    .min(1, "Venta no válida.");

  try {
    const validarVenta = schemaId.safeParse(id_venta);

    if (!validarVenta.success) {
      return {
        success: false,
        message: validarVenta.error.issues[0].message,
        timestamp: Date.now(),
      };
    }

    const resultado = await prisma.$transaction(async (tx) => {
      const venta = await tx.venta.findUniqueOrThrow({
        where: { id: id_venta },
        select: {
          id: true,
          estado: true,
          detalles: {
            select: { producto_id: true, cantidad: true },
          },
        },
      });

      if (venta.estado === EstadoVenta.CANCELADA) {
        return { yaCancelada: true as const };
      }

      await tx.venta.update({
        where: { id: id_venta },
        data: { estado: EstadoVenta.CANCELADA }
      });

      await Promise.all(
        venta.detalles.map((detalle) =>
          tx.producto.update({
            where: { id: detalle.producto_id },
            data: { stock_actual: { increment: detalle.cantidad } },
          })
        )
      );

      await tx.movimientoInventario.createMany({
        data: venta.detalles.map((detalle) => ({
            producto_id: detalle.producto_id,
            usuario_id: id_usuario,
            tipo: TipoMovimiento.ENTRADA,
            cantidad: detalle.cantidad,
            motivo: `Cancelación de venta #${id_venta}`,
            venta_id: id_venta,
        })),
      });

      return { yaCancelada: false as const };
    });

    if (resultado.yaCancelada) {
      return {
        success: true,
        message: `Esta venta ya se encuentra cancelada en el sistema. No se realizaron cambios.`,
        timestamp: Date.now(),
      };
    }

    revalidatePath("/ventas");
    log.success({ id_venta, id_usuario }, "Venta cancelada exitosamente.");

    return {
      success: true,
      message: `Venta #${id_venta} cancelada con éxito.`,
      timestamp: Date.now(),
    };

  } catch (error) {
    log.error("Ocurrió un error al cancelar la venta: ", error);

    let message = "Ocurrió un error en el servidor al ajustar el stock del producto.";

    if (error instanceof PrismaClientInitializationError) {
      message = "Error de conexión. Verifica tu conexión e intenta de nuevo.";
    } else if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      message = "La venta que intentas cancelar ya no existe.";
    }
    return {
      success: false,
      message,
      timestamp: Date.now(),
    };
  }
};
