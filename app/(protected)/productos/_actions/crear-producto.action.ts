"use server";

import { prisma } from "@/lib/prisma";
import { PrismaClientInitializationError } from "@prisma/client/runtime/client";
import { TipoMovimiento } from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { ProductoFormSchema, type ProductoFormState } from "../_schemas/crear-producto.schema";
import { createLogger } from "@/lib/logger";
import { verifySession } from "@/lib/dal/auth";

const log = createLogger("Productos/Crear");

export const crearProducto = async (_state: ProductoFormState, formData: FormData): Promise<ProductoFormState> => {
  const usuario = await verifySession();
  const id_usuario = Number(usuario.id_usuario);

  const rawFormData  = {
    nombre: formData.get("nombre")?.toString() || "",
    categoria: formData.get("categoria")?.toString() || "",
    precio: formData.get("precio")?.toString() || "",
    stock_actual: formData.get("stock_actual")?.toString() || "",
    stock_minimo: formData.get("stock_minimo")?.toString() || "",
  };

  //log.info("datos crudos: ", rawFormData)

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

  //log.info(validatedFields.data);

  try {

    const productoNuevo = await prisma.producto.create({
      data: {
        nombre,
        precio,
        categoria_id: categoria,
        stock_actual,
        stock_minimo,
        ...(stock_actual > 0 && {
          movimientos: {
            create: {
              usuario_id: id_usuario,
              tipo: TipoMovimiento.ENTRADA,
              cantidad: stock_actual,
              motivo: "Stock inicial",
            },
          },
        }),
      }
    });

    log.success({ id_producto: productoNuevo.id, nombre, id_usuario }, "Producto creado exitosamente.");

    revalidatePath("/productos");

    return {
      success: true,
      message: "Producto creado exitosamente.",
      timestamp: Date.now()
    };
    
  } catch (error) {
    log.error("Falló la creación del producto en la BD: ", error);

    let message = "Ocurrió un error en el servidor al guardar el producto.";

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
