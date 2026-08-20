import "server-only";

import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { RolUsuario } from "@/generated/prisma";

export type UsuarioActivo = {
  id: number;
  nombre: string;
  rol: RolUsuario;
  email: string;
};

export const obtenerUsuariosActivos = cache(async (): Promise<UsuarioActivo[]> => {
  return await prisma.usuario.findMany({
    select: {
      id: true,
      nombre: true,
      rol: true,
      email: true,
    },
    where: {
      activo: true,
    },
    orderBy: [
        {nombre: "asc"},
        {rol: "asc"},
    ]
  });
});
