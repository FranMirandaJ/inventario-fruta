import * as z from "zod";

export const RegenerarPasswordFormSchema = z.object({
    password: z
            .string()
            .trim()
            .min(1, "La contraseña es requerida.")
            .min(12, "La contraseña no esta alineada al formato establecido del sistema."), // lib/password.ts => generateRandomPassword()
});