"use server";

import bcrypt from "bcryptjs";
import { LoginFormSchema, FormState } from "./login.schema";
import { prisma } from "@/lib/prisma";

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

    return {
      message: `¡Bienvenido de nuevo, ${usuario.nombre.split(" ")[0]}!`,
    };

  } catch (error) {}
};
