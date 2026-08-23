export const PERMISOS = {
  dashboardVer: "dashboard.ver",
  productosVer: "productos.ver",
  productosCrear: "productos.crear",
  productosEditar: "productos.editar",
  productosCambiarEstado: "productos.cambiarEstado",
  productosAjustarStock: "productos.ajustarStock",
  ventasVer: "ventas.ver",
  ventasCrear: "ventas.crear",
  ventasCancelar: "ventas.cancelar",
  usuariosVer: "usuarios.ver",
  usuariosCrear: "usuarios.crear",
  usuariosEditar: "usuarios.editar",
  usuariosDeshabilitar: "usuarios.deshabilitar",
} as const;

export type Permiso = (typeof PERMISOS)[keyof typeof PERMISOS];

export type Rol = "ADMIN" | "VENDEDOR";

const TODOS_LOS_PERMISOS = Object.values(PERMISOS);

const PERMISOS_POR_ROL: Record<Rol, readonly Permiso[]> = {
  ADMIN: TODOS_LOS_PERMISOS,
  VENDEDOR: TODOS_LOS_PERMISOS.filter((p) => !p.startsWith("usuarios.")),
};

export function puede(rol: string, permiso: Permiso): boolean {
  const permisosDelRol = PERMISOS_POR_ROL[rol as Rol];
  if (!permisosDelRol) return false;
  return permisosDelRol.includes(permiso);
}
