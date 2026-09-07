import * as z from "zod";
import { PASSWORD_MIN_LENGTH } from "@/lib/password";

export const RegenerarPasswordFormSchema = z.object({
    password: z
            .string()
            .trim()
            .min(1, "La contraseña es requerida.")
            .min(PASSWORD_MIN_LENGTH, `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`), // lib/password.ts => PASSWORD_MIN_LENGTH
});