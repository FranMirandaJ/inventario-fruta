"use server";

import { prisma } from "@/lib/prisma";
import { PrismaClientInitializationError } from "@prisma/client/runtime/client";
import { createLogger } from "@/lib/logger";
import { verifySession } from "@/lib/dal/auth";
import { EditarUsuarioFormSchema } from "../_schemas/editar-usuario.schema";
import { revalidatePath } from "next/cache";
import { FormState } from "@/lib/form-state";
import { isPrismaError } from "@/lib/prisma-errors";

const log = createLogger("Usuario/editar");

export const editarUsuario = async (
  _state: FormState,
  formData: FormData,
): Promise<FormState> => {
  const usuario = await verifySession();
  const id_usuario_editor = Number(usuario.id_usuario);

  const id_usuario_a_editar = Number(formData.get("id_usuario_a_editar"));

  if (!id_usuario_a_editar || isNaN(id_usuario_a_editar)) {
    return {
      success: false,
      message: "Usuario no válido.",
      timestamp: Date.now(),
    };
  }

  const rawFormData = {
    nombre: formData.get("nombre")?.toString() || "",
    rol: formData.get("rol")?.toString() || "",
    email: formData.get("email")?.toString() || "",
  };

  const validatedFields = EditarUsuarioFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten((issue) => issue.message)
        .fieldErrors,
      message: "Faltan campos por llenar o hay errores.",
      timestamp: Date.now(),
      inputs: rawFormData,
    };
  }

  const { nombre, rol, email } = validatedFields.data;

  try {
    const usuarioEditado = await prisma.usuario.update({
      where: { id: id_usuario_a_editar },
      data: {
        nombre,
        email,
        rol,
      },
    });

    log.success(
      "Usuario editado exitosamente.",
      {
        id_usuario_editado: usuarioEditado.id,
        nombre_usuario_editado: usuarioEditado.nombre,
        id_usuario_editor: id_usuario_editor,
      }
    );

    revalidatePath("/usuarios");

    return {
      success: true,
      message: "Usuario editado exitosamente.",
      timestamp: Date.now(),
    };
  } catch (error) {
    log.error("Falló la edición de un usuario en la BD: ", error);

    let message = "Ocurrió un error en el servidor al editar al usuario.";

    if (error instanceof PrismaClientInitializationError) {
      message = "Error de conexión. Verifica tu conexión e intenta de nuevo.";
    } else if (isPrismaError(error)) {
      switch (error.code) {
        case "P2002":
          return {
            success: false,
            errors: { email: ["Este correo electrónico ya está registrado."] },
            message: "Faltan campos por llenar o hay errores.",
            timestamp: Date.now(),
            inputs: rawFormData,
          };
        case "P2025":
          message = "El usuario que intentas editar ya no existe.";
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
