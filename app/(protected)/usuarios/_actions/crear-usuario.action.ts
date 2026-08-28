"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { PrismaClientInitializationError } from "@prisma/client/runtime/client";
import { createLogger } from "@/lib/logger";
import { verifySession } from "@/lib/dal/auth";
import { puede, PERMISOS } from "@/lib/permisos";
import { CrearUsuarioFormSchema } from "../_schemas/crear-usuario.schema";
import { revalidatePath } from "next/cache";
import { FormState } from "@/lib/form-state";
import { isPrismaError } from "@/lib/prisma-errors";

const log = createLogger("Usuario/crear");

export const crearUsuario = async (
  _state: FormState,
  formData: FormData,
): Promise<FormState> => {
  const usuario = await verifySession();

  if (!puede(usuario.rol, PERMISOS.usuariosCrear)) {
    log.warn("Intento de crear usuario sin permisos.", {
      id_usuario: usuario.id_usuario,
      rol: usuario.rol,
    });
    return {
      success: false,
      message: "No tienes permisos para realizar esta acción.",
      timestamp: Date.now(),
    };
  }

  const rawFormData = {
    nombre: formData.get("nombre")?.toString() || "",
    rol: formData.get("rol")?.toString() || "",
    email: formData.get("email")?.toString() || "",
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

  const { nombre, rol, email, password } = validatedFields.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        rol,
        email,
        password: hashedPassword,
        debe_cambiar_password: true, // Por defecto el nuevo usuario al iniciar sesión hará un cambio de password.
      },
    });

    log.success(
      "Usuario nuevo creado exitosamente.",
      {
        id_nuevo_usuario: nuevoUsuario.id,
        nombre_nuevo_usuario: nuevoUsuario.nombre,
        id_usuario_creador: usuario.id_usuario,
      }
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
      }
    }

    return {
      success: false,
      message,
      timestamp: Date.now(),
    };
  }
};
