"use server";

import { prisma } from "@/lib/prisma";
import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
} from "@prisma/client/runtime/client";
import { VentaCarritoSchema, type CarritoState } from "../_schemas/crear-venta.schema";
import type { ConfirmarVentaItem } from "../_types";
import { verifySession } from "@/lib/dal/auth";
import { createLogger } from "@/lib/logger";


const log = createLogger("Ventas/Crear");

export const crearVenta = async (_state: CarritoState, data: ConfirmarVentaItem[]): Promise<CarritoState> => {

  await verifySession();

  log.info(data);

  const carritoValidado = VentaCarritoSchema.safeParse(data);
  
  if (!carritoValidado.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of carritoValidado.error.issues) {
      const path = issue.path.join(".");
      (fieldErrors[path] ??= []).push(issue.message);
    }
    return {
      success: false,
      errors: fieldErrors,
      message: "Faltan campos por llenar o hay errores.",
      timestamp: Date.now(),
    };
  }

  

  return {
    success: true,
    message: "Hola desde el action.",
    timestamp: Date.now(),
  };

};