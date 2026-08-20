"use server";

import { prisma } from "@/lib/prisma";
import { PrismaClientInitializationError } from "@prisma/client/runtime/client";
import { createLogger } from "@/lib/logger";
import { isPrismaError } from "@/lib/prisma-errors";
import { verifySession } from "@/lib/dal/auth";
import { revalidatePath } from "next/cache";

const log = createLogger("Usuario/deshabilitar");

export const deshabilitarUsuario = async() => {
    const usuario = verifySession();

    
};