"use server";

import bcrypt from "bcryptjs";
import { LoginFormSchema, FormState } from "./login.schema";
import { prisma } from "@/lib/prisma";
import { createLogger } from "@/lib/logger";

const log = createLogger("Auth/Login");

export const login = async (
  _state: FormState,
  formData: FormData,
): Promise<FormState> => {

  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan campos por llenar o hay errores.",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return {
        message: "Correo o contraseña incorrectos.",
      };
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return {
        message: "Correo o contraseña incorrectos.",
      };
    }

    // TODO: Justo aquí es donde se generará y guardará
    // la cookie de sesión

  } catch (error) {
    log.error(`${error instanceof Error ? error.message : String(error)}`);
    return {
      message: "Ocurrió un error en el servidor. Intenta de nuevo.",
    };
  }
};
