import { redirect } from "next/navigation";

/**
 * Valida que la página actual solicitada exista. Si no existe (ej. tras una
 * cancelación o eliminación), redirige a la última página válida preservando
 * los filtros actuales.
 *
 * Llamar en cada Server Component de paginación server-side después de
 * obtener totalPages.
 */
export function ensureValidPage(
  currentPage: number,
  totalPages: number,
  basePath: string,
  filters?: Record<string, string | undefined>,
  pageSize?: number,
) {
  if (currentPage <= 1 || currentPage <= totalPages) return;

  const params = new URLSearchParams();
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }
  }
  params.set("page", String(Math.max(1, totalPages)));
  if (pageSize) params.set("pageSize", String(pageSize));

  redirect(`${basePath}?${params.toString()}`);
}
