import type { FormState } from "@/lib/form-state";
import * as z from "zod";

export const AjustarStockFormSchema = z.object({
  id_producto: z.coerce
    .number("Producto no válido.")
    .int("Producto no válido.")
    .min(1, "Producto no válido."),
  nuevo_stock: z
    .string("La cantidad es requerida.")
    .min(1, "La cantidad es requerida.")
    .transform((val) => Number(val))
    .pipe(
      z.number("La cantidad debe ser un número válido." )
        .int("La cantidad deber ser un número entero.")
        .nonnegative("La cantidad debe ser un número mayor o igual a 0.")
    ),
});

export type AjustarStockFormState = FormState<
  {
    id_producto: string;
    nuevo_stock: string;
  },
  "id_producto" | "nuevo_stock"
>;
