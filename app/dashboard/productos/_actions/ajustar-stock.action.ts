"use server";

import { createLogger } from "@/lib/logger";
import {
  AjustarStockFormSchema,
  type AjustarStockFormState,
} from "../_schemas/ajustar-stock.schema";
import { verifySession } from "@/lib/dal/auth";

const log = createLogger("Productos/Ajustar-Stock");

export const ajustarStock = async (
  _state: AjustarStockFormState,
  formData: FormData,
): Promise<AjustarStockFormState> => {
  const usuario = await verifySession();
  const id_usuario = Number(usuario.id_usuario);


  return {
    success: false,
    timestamp: Date.now(),
    message: "HOLA",
  };
};
