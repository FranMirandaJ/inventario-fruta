"use server";

import bcrypt from "bcryptjs";
import { LoginFormSchema, type LoginFormState } from "./login.schema";
import { prisma } from "@/lib/prisma";
import { createLogger } from "@/lib/logger";

import { PrismaClientInitializationError } from "@prisma/client/runtime/client";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

const log = createLogger("Auth/Login");

export const login = async (
  _state: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> => {

  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten((issue) => issue.message).fieldErrors,
      message: "Faltan campos por llenar o hay errores.",
      timestamp: Date.now(),
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: {
         email,
         activo: true
       },
    });

    if (!usuario) {
      return {
        success: false,
        message: "Correo o contraseña incorrectos.",
        timestamp: Date.now(),
      };
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return {
        success: false,
        message: "Correo o contraseña incorrectos.",
        timestamp: Date.now(),
      };
    }

    await createSession(
      usuario.id.toString(),
      usuario.nombre,
      usuario.rol,
      usuario.debe_cambiar_password ? 1 : 0
    );

  } catch (error) {
    log.error(`${error instanceof Error ? error.message : String(error)}`);

    let message = "Ocurrió un error en el servidor. Intenta de nuevo.";

    if (error instanceof PrismaClientInitializationError) {
      message = "Error de conexión. Verifica tu conexión e intenta de nuevo.";
    }

    return {
      success: false,
      message,
      timestamp: Date.now(),
    };
  }

  redirect("/dashboard");

};
