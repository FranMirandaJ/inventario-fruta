"use server";

import { createLogger } from "@/lib/logger";
import { TipoMovimiento } from "@/generated/prisma";
import { PrismaClientInitializationError } from "@prisma/client/runtime/client";
import { AjustarStockFormSchema, type AjustarStockFormState } from "../_schemas/ajustar-stock.schema";
import { verifySession } from "@/lib/dal/auth";
import { puede, PERMISOS } from "@/lib/permisos";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { isPrismaError } from "@/lib/prisma-errors";

const log = createLogger("Productos/Ajustar-Stock");

export const ajustarStock = async (
  _state: AjustarStockFormState,
  formData: FormData,
): Promise<AjustarStockFormState> => {
  const usuario = await verifySession();
  const id_usuario = Number(usuario.id_usuario);

  if (!puede(usuario.rol, PERMISOS.productosAjustarStock)) {
    log.warn("Intento de ajustar stock sin permisos.", {
      id_usuario: usuario.id_usuario,
      rol: usuario.rol,
    });
    return {
      success: false,
      message: "No tienes permisos para realizar esta acción.",
      timestamp: Date.now(),
    };
  }

  const rawFormData = {
    id_producto: formData.get("id_producto")?.toString() || "",
    nuevo_stock: formData.get("nuevo_stock")?.toString() || "",
  };

  const validatedData = AjustarStockFormSchema.safeParse(rawFormData);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten((issue) => issue.message).fieldErrors,
      message: "Faltan campos por llenar o hay errores.",
      timestamp: Date.now(),
      inputs: rawFormData,
    };
  }

  try {

    const { id_producto, nuevo_stock } = validatedData.data;

    const productoAnterior = await prisma.producto.findUniqueOrThrow({
      where: { id: id_producto },
      select: { stock_actual: true }
    });

    const diferenciaStock = nuevo_stock - productoAnterior.stock_actual;

    await prisma.$transaction(async (tx) => {
      await tx.producto.update({
        where: { id: id_producto },
        data: { stock_actual: nuevo_stock },
      });
      if (diferenciaStock !== 0) {
        await tx.movimientoInventario.create({
          data: {
            producto_id: id_producto,
            usuario_id: id_usuario,
            tipo: diferenciaStock > 0 ? TipoMovimiento.ENTRADA : TipoMovimiento.AJUSTE,
            cantidad: Math.abs(diferenciaStock),
            motivo: "Ajuste manual desde edición",
          },
        });
      }
    });

    log.success("Stock de producto ajustado exitosamente.", { id_producto, nuevo_stock, id_usuario });

    revalidatePath("/productos");

    return {
      success: true,
      message: "Producto ajustado exitosamente.",
      timestamp: Date.now(),
    };

  } catch (error) {
    log.error("Falló el ajuste del stock del producto en la BD: ", error);

    let message = "Ocurrió un error en el servidor al ajustar el stock del producto.";

    if (error instanceof PrismaClientInitializationError) {
      message = "Error de conexión. Verifica tu conexión e intenta de nuevo.";
    } else if (isPrismaError(error)) {
      switch (error.code) {
        case "P2025":
          message = "El producto que intentas ajustar ya no existe.";
          break;
      }
    }
    
    return {
      success: false,
      message,
      timestamp: Date.now(),
    };
  }

};
