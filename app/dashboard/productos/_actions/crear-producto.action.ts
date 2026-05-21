"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CrearProductoFormSchema, FormState } from "../_schemas/crear-producto.schema";
import { createLogger } from "@/lib/logger";

const log = createLogger("Productos/Crear");

export const crearProducto = async (_state: FormState, formData: FormData): Promise<FormState> => {

  log.info(formData);

  const validatedFields = CrearProductoFormSchema.safeParse({
    nombre: formData.get("nombre"),
    categoria: formData.get("categoria"),
    precio: formData.get("precio"),
    stock_actual: formData.get("stock_actual"),
    stock_minimo: formData.get("stock_minimo"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten((issue) => issue.message).fieldErrors,
      message: "Faltan campos por llenar o hay errores.",
      timestamp: Date.now()
    };
  }

  const { nombre, categoria, precio, stock_actual, stock_minimo } = validatedFields.data;

  log.info(validatedFields.data);

  try {
    
  } catch (error) {
    
  }

};
