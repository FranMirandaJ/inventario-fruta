"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { PrismaClientInitializationError } from "@prisma/client/runtime/client";
import { createLogger } from "@/lib/logger";
import { verifySession } from "@/lib/dal/auth";
import {
  CrearUsuarioFormSchema,
  type CrearUsuarioFormState,
} from "../_schemas/crear-usuario.schema";
import { revalidatePath } from "next/cache";

const log = createLogger("Usuario/crear");

export const crearUsuario = async (
  _state: CrearUsuarioFormState,
  formData: FormData,
): Promise<CrearUsuarioFormState> => {
  const usuario = await verifySession();

  const rawFormData = {
    nombre: formData.get("nombre")?.toString() || "",
    rol: formData.get("rol")?.toString() || "",
    correo: formData.get("correo")?.toString() || "",
    password: formData.get("password")?.toString() || "",
  };

  const validatedFields = CrearUsuarioFormSchema.safeParse(rawFormData);

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

  const { nombre, rol, correo, password } = validatedFields.data;

  try {

    const existente = await prisma.usuario.findUnique({
        where: { email: correo },
        select: { id: true }
    });

    if (existente) {
        return {
        success: false,
        errors: { correo: ["Este correo electrónico ya está registrado."] },
        message: "Faltan campos por llenar o hay errores.", // Error generico en el toast.
        timestamp: Date.now(),
        inputs: rawFormData,
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        rol,
        email: correo,
        password: hashedPassword,
        debe_cambiar_password: true, // Por defecto el nuevo usuario al iniciar sesión hará un cambio de password.
      },
    });

    log.success(
      {
        id_nuevo_usuario: nuevoUsuario.id,
        nombre_nuevo_usuario: nuevoUsuario.nombre,
        id_usuario_creador: usuario.id_usuario,
      },
      "Usuario nuevo creado exitosamente.",
    );

    revalidatePath("/usuarios");

    return {
      success: true,
      message: "Usuario creado exitosamente.",
      timestamp: Date.now(),
    };
  } catch (error) {
    log.error("Falló la creación de un nuevo usuario en la BD: ", error);

    let message = "Ocurrió un error en el servidor al crear al usuario.";

    if (error instanceof PrismaClientInitializationError) {
      message = "Error de conexión. Verifica tu conexión e intenta de nuevo.";
    }

    return {
      success: false,
      message,
      timestamp: Date.now(),
    };
  }
};
