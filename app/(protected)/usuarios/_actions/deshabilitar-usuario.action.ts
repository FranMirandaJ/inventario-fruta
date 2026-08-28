"use server";

import { prisma } from "@/lib/prisma";
import { PrismaClientInitializationError } from "@prisma/client/runtime/client";
import { createLogger } from "@/lib/logger";
import { isPrismaError } from "@/lib/prisma-errors";
import { verifySession } from "@/lib/dal/auth";
import { puede, PERMISOS } from "@/lib/permisos";
import { revalidatePath } from "next/cache";
import { FormState } from "@/lib/form-state";
import z from "zod";

const log = createLogger("Usuario/deshabilitar");

export const deshabilitarUsuario = async (
  id_usuario: number,
): Promise<FormState> => {
  const usuarioLogueado = await verifySession();
  const id_usuarioLogueado = Number(usuarioLogueado.id_usuario);

  if (!puede(usuarioLogueado.rol, PERMISOS.usuariosDeshabilitar)) {
    log.warn("Intento de deshabilitar usuario sin permisos.", {
      id_usuario: usuarioLogueado.id_usuario,
      rol: usuarioLogueado.rol,
    });
    return {
      success: false,
      message: "No tienes permisos para realizar esta acción.",
      timestamp: Date.now(),
    };
  }

  const schemaId = z.coerce
    .number("Usuario no válido.")
    .int("Usuario no válido.")
    .min(1, "Usuario no válido.");

  const validarUsuario = schemaId.safeParse(id_usuario);

  if (!validarUsuario.success) {
    return {
      success: false,
      message: validarUsuario.error.issues[0].message,
      timestamp: Date.now(),
    };
  }

  if (id_usuarioLogueado === id_usuario){
    return {
      success: false,
      message: "No te puedes deshabilitar a ti mismo.",
      timestamp: Date.now(),
    };
  }

  try {
    const usuarioDeshabilitado = await prisma.usuario.update({
      where: { id: id_usuario },
      data: { activo: false },
      select: { id: true },
    });

    log.success("Usuario deshabilitado exitosamente.", {
      id_usuario_deshabilitado: usuarioDeshabilitado.id,
      id_usuario_responsable: usuarioLogueado.id_usuario,
    });
    
    revalidatePath("/usuarios");

    return {
      success: true,
      message: "Usuario deshabilitado con éxito.",
      timestamp: Date.now(),
    };
  } catch (error) {
    log.error(
      "Ocurrió un error al intentar deshabilitar a un usuario: ",
      error,
    );

    let message = "Ocurrió un error en el servidor al deshabilitar al usuario.";

    if (error instanceof PrismaClientInitializationError) {
      message = "Error de conexión. Verifica tu conexión e intenta de nuevo.";
    } else if (isPrismaError(error)) {
      switch (error.code) {
        case "P2025":
          message = "El usuario que intentas deshabilitar ya no existe.";
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
