"use server";

import { prisma } from "@/lib/prisma";
import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
} from "@prisma/client/runtime/client";
import { verifySession } from "@/lib/dal/auth";
import { createLogger } from "@/lib/logger";

const log = createLogger("Ventas/Crear");

export const crearVenta = async () => {
  await verifySession();
  
};