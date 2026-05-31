import type { FormState } from "@/lib/form-state";
import type { ConfirmarVentaItem } from "../_types";
import * as z from "zod";

export const VentaCarritoItemSchema = z.object({
  id_producto: z
    .number({ message: "El producto es requerido." })
    .int("El producto no es válido.")
    .positive("El producto no es válido."),
  cantidad: z
    .number({ message: "La cantidad del producto es requerida." })
    .int("La cantidad del producto debe ser un número entero.")
    .positive("La cantidad del prodcuto debe ser mayor a 0."),
});

export const VentaCarritoSchema = z.object({
  items: z
    .array(VentaCarritoItemSchema)
    .min(1, "Debe agregar al menos un producto al carrito."),
});

export type CarritoState = FormState<{ items: string }, "items">;