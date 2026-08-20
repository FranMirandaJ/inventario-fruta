import { RolUsuario } from "@/generated/prisma";

export const rolLabels: Record<RolUsuario, string> = {
  ADMIN: "Administrador",
  VENDEDOR: "Vendedor",
};
