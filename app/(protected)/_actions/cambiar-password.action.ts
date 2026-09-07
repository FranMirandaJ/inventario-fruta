"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { PrismaClientInitializationError } from "@prisma/client/runtime/client";

import { verifySession } from "@/lib/dal/auth";
import { prisma } from "@/lib/prisma";
import { updateSession } from "@/lib/session";
import { createLogger } from "@/lib/logger";
import { isPrismaError } from "@/lib/prisma-errors";
import {
  CambiarPasswordFormSchema,
  type CambiarPasswordFormState,
} from "../_schemas/cambiar-password.schema";

const log = createLogger("Auth/CambiarPassword");

export const cambiarPassword = async (
  _state: CambiarPasswordFormState,
  formData: FormData,
): Promise<CambiarPasswordFormState> => {
  const usuario = await verifySession();
  const id_usuario = Number(usuario.id_usuario);

  const rawFormData = {
    password_actual: formData.get("password_actual")?.toString() || "",
    password: formData.get("password")?.toString() || "",
    password_confirmacion: formData.get("password_confirmacion")?.toString() || "",
  };

  const validatedFields = CambiarPasswordFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten((issue) => issue.message)
        .fieldErrors,
      message: "Faltan campos por llenar o hay errores.",
      timestamp: Date.now(),
    };
  }

  const { password_actual, password } = validatedFields.data;

  try {
    const usuarioDB = await prisma.usuario.findUnique({
      where: { id: id_usuario },
    });

    if (!usuarioDB || !usuarioDB.activo) {
      return {
        success: false,
        message: "El usuario ya no existe o está deshabilitado.",
        timestamp: Date.now(),
      };
    }

    const passwordActualValida = await bcrypt.compare(
      password_actual,
      usuarioDB.password,
    );

    if (!passwordActualValida) {
      log.warn("Intento de cambio de contraseña con contraseña actual incorrecta.", {
        id_usuario,
      });
      return {
        success: false,
        errors: {
          password_actual: ["La contraseña actual es incorrecta."],
        },
        message: "Faltan campos por llenar o hay errores.",
        timestamp: Date.now(),
      };
    }

    const esIgualAnterior = await bcrypt.compare(password, usuarioDB.password);

    if (esIgualAnterior) {
      return {
        success: false,
        errors: {
          password: ["La nueva contraseña debe ser diferente a la actual."],
        },
        message: "Faltan campos por llenar o hay errores.",
        timestamp: Date.now(),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.usuario.update({
      where: { id: id_usuario },
      data: {
        password: hashedPassword,
        debe_cambiar_password: false,
      },
    });

    // Se limpia el flag en el JWT manteniendo la sesión iniciada.
    await updateSession({ debe_cambiar_password: 0 });

    revalidatePath("/", "layout");

    log.success("Contraseña actualizada exitosamente.", { id_usuario });

    return {
      success: true,
      message: "Contraseña actualizada. Ya puedes continuar.",
      timestamp: Date.now(),
    };
  } catch (error) {
    log.error("Falló el cambio de contraseña en la BD: ", error);

    let message = "Ocurrió un error en el servidor al cambiar la contraseña.";

    if (error instanceof PrismaClientInitializationError) {
      message = "Error de conexión. Verifica tu conexión e intenta de nuevo.";
    } else if (isPrismaError(error)) {
      switch (error.code) {
        case "P2025":
          message = "El usuario ya no existe.";
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