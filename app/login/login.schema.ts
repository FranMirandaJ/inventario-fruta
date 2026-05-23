import type { FormState } from "@/lib/form-state";
import * as z from "zod";

export const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio.") 
    .email("Introduzca una dirección de correo válida.")
    .trim(),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria.")
    .trim(),
});

export type LoginFormState = FormState<never, "email" | "password">;