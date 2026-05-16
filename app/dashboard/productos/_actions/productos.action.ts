"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProductoFormSchema, FormState } from "./productos.schema";
import { createLogger } from "@/lib/logger";

const log = createLogger("Productos/Crear");

export const crearProducto = async (
  _state: FormState,
  formData: FormData,
): Promise<FormState> => {
  const validatedFields = ProductoFormSchema.safeParse({
    nombre: formData.get("nombre"),
    categoriaId: formData.get("categoriaId"),
    presentacion: formData.get("presentacion") || "",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campos inválidos.",
    };
  }

  const { nombre, categoriaId, presentacion } = validatedFields.data;

  try {
    await prisma.producto.create({
      data: {
        nombre,
        categoria_id: categoriaId,
        presentacion,
        precio: 0,
      },
    });
  } catch (error) {
    log.error(`${error instanceof Error ? error.message : String(error)}`);
    return {
      message: "Error al crear el producto.",
    };
  }

  redirect("/dashboard/productos");
};
