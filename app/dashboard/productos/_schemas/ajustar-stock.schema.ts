import type { FormState } from "@/lib/form-state";
import * as z from "zod";

export const AjustarStockFormSchema = z.object({
  id_producto: z.coerce
    .number("Producto no válido.")
    .int("Producto no válido.")
    .min(1, "Producto no válido."),
  nuevo_stock: z.coerce
    .number("La cantidad debe ser un número.")
    .int("La cantidad deber ser un número entero.")
    .nonnegative("La cantidad debe ser un número mayor o igual a 0."),
});

export type AjustarStockFormState = FormState<
  {
    id_producto: string;
    nuevo_stock: string;
  },
  "id_producto" | "nuevo_stock"
>;
