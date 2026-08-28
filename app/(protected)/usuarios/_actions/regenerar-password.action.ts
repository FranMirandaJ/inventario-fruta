"use server";

import { createLogger } from "@/lib/logger";
import { FormState } from "@/lib/form-state";
import { isPrismaError } from "@/lib/prisma-errors";
import { prisma } from "@/lib/prisma";
import { PrismaClientInitializationError } from "@prisma/client/runtime/client";
import { puede, PERMISOS } from "@/lib/permisos";
import { verifySession } from "@/lib/dal/auth";
import { RegenerarPasswordFormSchema } from "../_schemas/regenerar-password.schema";
import bcrypt from "bcryptjs";

const log = createLogger("Usuario/RegenerarPassword");

export const regenerarPassword = async (
  id_usuario: number,
  _state: FormState,
  formData: FormData,
): Promise<FormState> => {
  const usuario_logueado = await verifySession();
  const id_usuario_logueado = Number(usuario_logueado.id_usuario);

  if (!puede(usuario_logueado.rol, PERMISOS.usuariosGenerarNuevaPassword)) {
    log.warn("Intento de regenerar un password sin permisos.", {
      id_usuario: id_usuario_logueado,
      rol: usuario_logueado.rol,
    });
    return {
      success: false,
      message: "No tienes permisos para realizar esta acción.",
      timestamp: Date.now(),
    };
  }

  if (id_usuario === id_usuario_logueado) {
    log.warn("Intento de regenerar la propia password.", {
      id_usuario: id_usuario_logueado,
    });
    return {
      success: false,
      message: "No puedes reestablecer tu propia contraseña.",
      timestamp: Date.now(),
    };
  }

  const rawFormData = { password: formData.get("password")?.toString() || "" };

  const validatedFields = RegenerarPasswordFormSchema.safeParse(rawFormData);

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

  const { password } = validatedFields.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const usuarioEditado = await prisma.usuario.update({
      where: { id: id_usuario },
      data: {password: hashedPassword, debe_cambiar_password: true},
    });

    log.success("Password reestablecida exitosamente.", {
      id_usuario_afectado: usuarioEditado.id,
      id_usuario_responsable: id_usuario_logueado,
    });

    return {
      success: true,
      message: "Contraseña reestablecida exitosamente.",
      timestamp: Date.now(),
    };
  } catch (error) {
    log.error("Falló el reestablecimiento de pasword de un usuario: ", error);

    let message = "Ocurrió un error en el servidor al reestablecer la contraseña.";

    if (error instanceof PrismaClientInitializationError) {
      message = "Error de conexión. Verifica tu conexión e intenta de nuevo.";
    } else if (isPrismaError(error)) {
      switch (error.code) {
        case "P2025":
          message = "El usuario al que intentas reestablecer su contraseña ya no existe.";
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
