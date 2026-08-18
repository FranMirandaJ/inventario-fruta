import * as z from 'zod';
import { RolUsuario } from '@/generated/prisma';
import { FormState } from '@/lib/form-state';

export const CrearUsuarioFormSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(1, "El nombre es requerido."),
    rol: z.enum(RolUsuario, "Rol inválido."),
    correo: z
        .email("Formato de correo electrónico inválido."),
    password: z
        .string()
        .trim()
        .min(1, "La contraseña es requerida.")
        .min(12, "La contraseña no esta alineada al formato establecido."), // lib/password.ts => generateRandomPassword()
});

export type CrearUsuarioFormState = FormState<
    {
        nombre: string;
        rol: string;
        correo: string;
        password: string;
    },
    "nombre" | "rol" | "correo" | "password"
>;