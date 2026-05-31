"use server";

import { prisma } from "@/lib/prisma";
import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
} from "@prisma/client/runtime/client";
import type { CarritoState } from "../_schemas/crear-venta.schema";
import type { ConfirmarVentaItem } from "../_types";
import { verifySession } from "@/lib/dal/auth";
import { createLogger } from "@/lib/logger";


const log = createLogger("Ventas/Crear");

export const crearVenta = async (_state: CarritoState, data: ConfirmarVentaItem[]): Promise<CarritoState> => {

  await verifySession();

  log.info(data);

  if (data.length === 0) {
    return {
      success: false,
      message: "El carrito está vacío.",
      timestamp: Date.now(),
    };
  }
  
  

  return {
    success: true,
    message: "Hola desde el action."
  };

};