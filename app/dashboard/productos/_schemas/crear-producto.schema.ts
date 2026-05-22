import * as z from "zod";

export const CrearProductoFormSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es requerido."),
  categoria: z
    .coerce
    .number({ message: "La categoría es requerida." })
    .int("La categoría no es válida.")
    .positive("La categoría no es válida."),
  precio: z
    .coerce
    .number({ message: "El precio no es válido." })
    .gt(0, "El precio deber ser mayor a 0."), 
  stock_actual: z
    .coerce
    .number({ message: "El stock actual no es válido." })
    .int("El stock actual debe ser un número entero.")
    .nonnegative("El stock actual debe ser mayor o igual a 0.")
    .default(0), 
  stock_minimo: z
    .coerce
    .number({ message: "El stock mínimo no es válido." })
    .int("El stock mínimo debe ser un número entero.") 
    .min(1, "El stock mínimo debe ser de al menos 1.")
    .catch(1),
});

export type FormState =
  | {
      success: boolean;
      errors?: {
        nombre?: string[];
        categoria?: string[];
        precio?: string[];
        stock_actual?: string[];
        stock_minimo?: string[];
      };
      message?: string;
      timestamp?: number;
      inputs?: {
        nombre: string;
        categoria: string;
        precio: string;
        stock_actual: string;
        stock_minimo: string;
      };
    }
  | undefined;
