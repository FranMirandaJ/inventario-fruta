"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PrismaClientKnownRequestError, PrismaClientInitializationError } from "@prisma/client/runtime/client";
import { ProductoFormSchema, type ProductoFormState } from "../_schemas/crear-producto.schema";
import { createLogger } from "@/lib/logger";
import { verifySession } from "@/lib/dal/auth";

const log = createLogger("Productos/Actualizar");

export const actualizarProducto = async (_state: ProductoFormState, formData: FormData): Promise<ProductoFormState> => {
  const usuario = await verifySession();
  const id_usuario = Number(usuario.id_usuario);

  const id = Number(formData.get("producto_id"));

  if (!id || isNaN(id)) {
    return {
      success: false,
      message: "Producto no válido.",
      timestamp: Date.now(),
    };
  }

  const rawFormData = {
    nombre: formData.get("nombre")?.toString() || "",
    categoria: formData.get("categoria")?.toString() || "",
    precio: formData.get("precio")?.toString() || "",
    stock_actual: formData.get("stock_actual")?.toString() || "",
    stock_minimo: formData.get("stock_minimo")?.toString() || "",
  };

  const validatedFields = ProductoFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten((issue) => issue.message).fieldErrors,
      message: "Faltan campos por llenar o hay errores.",
      timestamp: Date.now(),
      inputs: rawFormData,
    };
  }

  const { nombre, categoria, precio, stock_actual, stock_minimo } = validatedFields.data;

  try {
    const productoActualizado = await prisma.producto.update({
      where: { id },
      data: {
        nombre,
        precio,
        categoria_id: categoria,
        stock_actual,
        stock_minimo,
      },
    });

    log.success({ id_producto: id, nombre, id_usuario }, "Producto actualizado exitosamente");

    revalidatePath("/dashboard/productos");

    return {
      success: true,
      message: "Producto actualizado exitosamente.",
      timestamp: Date.now(),
    };
  } catch (error) {

    log.error("Falló la actualización del producto en la BD: ", error);

    let message = "Ocurrió un error en el servidor al actualizar el producto.";

    if (error instanceof PrismaClientInitializationError) {
      message = "Error de conexión. Verifica tu conexión e intenta de nuevo.";
    } else if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      message = "El producto que intentas editar ya no existe.";
    }

    return {
      success: false,
      message,
      timestamp: Date.now(),
    };
  }
};
