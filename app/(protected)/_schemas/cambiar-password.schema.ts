import * as z from "zod";
import { PASSWORD_MIN_LENGTH } from "@/lib/password";
import type { FormState } from "@/lib/form-state";

export const CambiarPasswordFormSchema = z
  .object({
    password_actual: z
      .string()
      .min(1, "La contraseña actual es obligatoria.")
      .trim(),
    password: z
      .string()
      .trim()
      .min(
        PASSWORD_MIN_LENGTH,
        `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`,
      ),
    password_confirmacion: z
      .string()
      .trim()
      .min(1, "Confirma tu nueva contraseña."),
  })
  .refine((data) => data.password === data.password_confirmacion, {
    path: ["password_confirmacion"],
    message: "Las contraseñas no coinciden.",
  });

export type CambiarPasswordFormState = FormState<
  never,
  "password_actual" | "password" | "password_confirmacion"
>;