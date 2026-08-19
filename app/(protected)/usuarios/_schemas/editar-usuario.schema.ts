import * as z from 'zod';
import { RolUsuario } from '@/generated/prisma';

export const EditarUsuarioFormSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(1, "El nombre es requerido."),
    rol: z.enum(RolUsuario, "Rol inválido."),
    email: z.email("Formato de correo electrónico inválido."),
});