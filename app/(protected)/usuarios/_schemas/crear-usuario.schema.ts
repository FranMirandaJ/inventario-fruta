import * as z from 'zod';
import { RolUsuario } from '@/generated/prisma';

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
        .min(12, "La contraseña no esta alineada al formato establecido del sistema."), // lib/password.ts => generateRandomPassword()
});