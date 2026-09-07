import * as z from 'zod';
import { RolUsuario } from '@/generated/prisma';
import { PASSWORD_MIN_LENGTH } from '@/lib/password';

export const CrearUsuarioFormSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(1, "El nombre es requerido."),
    rol: z.enum(RolUsuario, "Rol inválido."),
    email: z
        .email("Formato de correo electrónico inválido."),
    password: z
        .string()
        .trim()
        .min(1, "La contraseña es requerida.")
        .min(PASSWORD_MIN_LENGTH, `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`), // lib/password.ts => PASSWORD_MIN_LENGTH
});