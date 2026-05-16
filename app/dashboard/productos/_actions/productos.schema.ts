import * as z from "zod";

export const ProductoFormSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio.")
    .trim(),
  categoriaId: z
    .coerce.number()
    .int("La categoría no es válida.")
    .positive("Seleccione una categoría."),
  presentacion: z
    .string()
    .optional()
    .default(""),
});

export type FormState =
  | {
      errors?: {
        nombre?: string[];
        categoriaId?: string[];
        presentacion?: string[];
      };
      message?: string;
    }
  | undefined;
