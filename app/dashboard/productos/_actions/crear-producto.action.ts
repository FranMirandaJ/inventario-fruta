"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CrearProductoFormSchema, type ProductoFormState } from "../_schemas/crear-producto.schema";
import { createLogger } from "@/lib/logger";
import { verifySession } from "@/lib/dal/auth";

const log = createLogger("Productos/Crear");

export const crearProducto = async (_state: ProductoFormState, formData: FormData): Promise<ProductoFormState> => {

  await verifySession();

  const rawFormData  = {
    nombre: formData.get("nombre")?.toString() || "",
    categoria: formData.get("categoria")?.toString() || "",
    precio: formData.get("precio")?.toString() || "",
    stock_actual: formData.get("stock_actual")?.toString() || "",
    stock_minimo: formData.get("stock_minimo")?.toString() || "",
  };

  //log.info("datos crudos: ", rawFormData)

  const validatedFields = CrearProductoFormSchema.safeParse(rawFormData);

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
      }
    });

    log.success('Se creo un nuevo producto:', productoNuevo);

    revalidatePath("/dashboard/productos");

    return {
      success: true,
      message: "Producto creado exitosamente.",
      timestamp: Date.now()
    };
    
  } catch (error) {
    log.error("Falló la creación del producto en la BD", error);

    return {
      success: false,
      message: "Ocurrió un error en el servidor al guardar el producto.",
      timestamp: Date.now()
    };
  }

};
