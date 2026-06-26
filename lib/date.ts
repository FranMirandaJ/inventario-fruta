/**
 * Convierte una fecha local (YYYY-MM-DD) a un objeto Date UTC
 * usando el offset del cliente en minutos.
 *
 * @param dateStr - Fecha en formato "YYYY-MM-DD"
 * @param offsetMin - Offset del cliente en minutos (ej. 360 para UTC-6)
 * @param endOfDay - Si true, devuelve el final del día (23:59:59.999)
 * @returns Date en UTC
 */
export function dateFromLocal(dateStr: string, offsetMin: number, endOfDay?: boolean): Date {
  const sign = offsetMin <= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const offset = `${sign}${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  const time = endOfDay ? "T23:59:59.999" : "T00:00:00";
  return new Date(`${dateStr}${time}${offset}`);
}

/**
 * Da formato humano a una fecha mostrando "Hoy", "Ayer" o la fecha completa
 * según qué tan reciente sea.
 *
 * Útil para mostrar fechas de ventas, movimientos o cualquier registro
 * donde interese más la referencia relativa que la fecha exacta.
 *
 * @param date - Fecha en UTC (desde la BD)
 * @param locale - Código de idioma (por defecto "es-MX")
 * @returns "Hoy, 8:38 PM" | "Ayer, 3:15 PM" | "25 de junio de 2026, 8:38 PM"
 */
export function formatRelativeDate(date: Date, locale = "es-MX"): string {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const d = new Date(date);
  const dateStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const time = d.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
  });

  if (dateStart.getTime() === todayStart.getTime()) {
    return `Hoy, ${time}`;
  }

  if (dateStart.getTime() === yesterdayStart.getTime()) {
    return `Ayer, ${time}`;
  }

  return d.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
