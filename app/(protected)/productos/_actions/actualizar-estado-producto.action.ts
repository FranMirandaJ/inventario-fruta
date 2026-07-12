"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
} from "@prisma/client/runtime/client";
import { type ProductoFormState } from "../_schemas/crear-producto.schema";
import { createLogger } from "@/lib/logger";
import { verifySession } from "@/lib/dal/auth";

const log = createLogger("Productos/Actualizar-Estado");

export const cambiarEstadoProducto = async (
  _state: ProductoFormState,
  formData: FormData,
): Promise<ProductoFormState> => {
  const usuario = await verifySession();
  const id_usuario = Number(usuario.id_usuario);

  const id = Number(formData.get("id"));

  if (!id || isNaN(id)) {
    return {
      success: false,
      message: "Producto no válido.",
      timestamp: Date.now(),
    };
  }

  try {

    const producto = await prisma.producto.findUnique({
      where: { id },
      select: { activo: true },
    });

    if (!producto) {
      return { success: false, message: "El producto ya no existe.", timestamp: Date.now() };
    }

    const productoActualizado = await prisma.producto.update({ // Esto puede originar un error de prisma P2025
      where: { id },
      data: { activo: !producto?.activo },
    });

    log.success({ id_producto: id, id_usuario, activo: productoActualizado.activo }, "Estado de producto actualizado.");

     revalidatePath("/productos");

    return {
      success: true,
      message: `Producto ${productoActualizado.activo ? "activado" : "desactivado"}.`,
      timestamp: Date.now(),
    };
  } catch (error) {
    log.error(
      "Falló la activación o desactivación de un producto en la BD: ",
      error,
    );

    let message = "Ocurrió un error en el servidor al actualizar el producto.";

    if (error instanceof PrismaClientInitializationError) {
      message = "Error de conexión. Verifica tu conexión e intenta de nuevo.";
    } else if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      message = "El producto que intentas editar ya no existe.";
    }

    return {
      success: false,
      message,
      timestamp: Date.now(),
    };
  }
};
