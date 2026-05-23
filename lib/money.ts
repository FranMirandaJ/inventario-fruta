/**
 * Formatea un número o string a moneda con 2 decimales.
 * Usa la API nativa Intl.NumberFormat para poner las comas y puntos correctamente.
 * Ejemplo: 1234.5 -> "$1,234.50"
 */
export const formatCurrency = (
  amount: number | string,
  locale: string = "es-MX", // Puedes cambiarlo por defecto al que prefieras
  currency: string = "MXN"
): string => {
  // Convertimos a número por si llega como string desde un input
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  
  // Si envían texto que no es número, evitamos que crashee devolviendo $0.00
  if (isNaN(numericAmount)) return "$0.00";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};