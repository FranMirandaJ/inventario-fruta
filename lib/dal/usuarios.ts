import "server-only";

import { prisma } from "@/lib/prisma";
import { cache } from "react";

export type UsuarioActivo = {
  id: number;
  nombre: string;
  rol: string;
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
