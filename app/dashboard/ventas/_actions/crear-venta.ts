"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Prisma, TipoMovimiento } from "@/generated/prisma";
import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
} from "@prisma/client/runtime/client";
import {
  VentaCarritoSchema,
  type CarritoState,
} from "../_schemas/crear-venta.schema";
import type { ConfirmarVentaItem } from "../_types";
import { verifySession } from "@/lib/dal/auth";
import { createLogger } from "@/lib/logger";

const log = createLogger("Ventas/Crear");

export const crearVenta = async (
  _state: CarritoState,
  data: ConfirmarVentaItem[],
): Promise<CarritoState> => {
  
  try {
    const usuario_id = Number((await verifySession()).id_usuario);
  
    const carritoValidado = VentaCarritoSchema.safeParse(data);

    if (!carritoValidado.success) {
      const mensajes = [
        ...new Set(carritoValidado.error.issues.map((i) => i.message)),
      ];
      return {
        success: false,
        message: mensajes.join(". "),
        timestamp: Date.now(),
      };
    }

    const idsProductosSeleccionados = carritoValidado.data.map(
      (p) => p.id_producto,
    );

    const productosSeleccionados = await prisma.producto.findMany({
      where: {
        id: { in: idsProductosSeleccionados },
      },
      select: {
        id: true,
        nombre: true,
        precio: true,
        stock_actual: true,
        activo: true,
      },
    });

    if (productosSeleccionados.length !== idsProductosSeleccionados.length) {
      return {
        success: false,
        message: "Uno o más productos ya no están disponibles.",
        timestamp: Date.now(),
      };
    }

    const productosInactivos = productosSeleccionados.filter((p) => !p.activo);
    if (productosInactivos.length > 0) {
      const nombres = productosInactivos.map((p) => `"${p.nombre}"`).join(", ");
      return {
        success: false,
        message: `Productos inactivos en el carrito: ${nombres}.`,
        timestamp: Date.now(),
      };
    }

    for (const item of carritoValidado.data) {
      const prod = productosSeleccionados.find(
        (p) => p.id === item.id_producto,
      )!;
      if (item.cantidad > prod.stock_actual) {
        return {
          success: false,
          message: `Stock insuficiente de "${prod.nombre}". Disponible: ${prod.stock_actual}`,
          timestamp: Date.now(),
        };
      }
    }

    const total = carritoValidado.data.reduce((sum, item) => {
      const prod = productosSeleccionados.find(
        (p) => p.id === item.id_producto,
      )!;
      return sum + Number(prod.precio) * item.cantidad;
    }, 0);

    const venta = await prisma.$transaction(async (tx) => {

      const ventaCreada = await tx.venta.create({
        data: {
          total: total,
          usuario_id,
          detalles: {
            create: carritoValidado.data.map(item => {
              const prod = productosSeleccionados.find(
                (p) => p.id === item.id_producto,
              )!;
              const precioUnitario = Number(prod.precio);
              return {
                producto_id: item.id_producto,
                cantidad: item.cantidad,
                precio_unitario: new Prisma.Decimal(precioUnitario),
                subtotal: new Prisma.Decimal(precioUnitario * item.cantidad),
              };
            }),
          },
          movimientoInventarios: {
            create: carritoValidado.data.map(item => ({
              producto_id: item.id_producto,
              usuario_id,
              tipo: TipoMovimiento.SALIDA,
              cantidad: item.cantidad,
              motivo: "Venta registrada",
            })),
          },
        },
      });

      for (const item of carritoValidado.data) {
        await tx.producto.update({
          where: { id: item.id_producto },
          data: { stock_actual: { decrement: item.cantidad } },
        });
      }

      return ventaCreada;
    });

    revalidatePath("/dashboard/ventas");
    log.success({ id_venta: venta.id, total, usuario_id }, "Venta creada exitosamente");

    return {
      success: true,
      message: `Venta #${venta.id} registrada con éxito.`,
      timestamp: Date.now(),
    };

  } catch (error) {
    log.error("Falló la creación de la venta en la BD: ", error);
    
    let message = "Ocurrió un error en el servidor al registrar la venta.";

    if (error instanceof PrismaClientInitializationError) {
      message = "Error de conexión. Verifica tu conexión e intenta de nuevo.";
    }

    return {
      success: false,
      message,
      timestamp: Date.now()
    };
  }
};
