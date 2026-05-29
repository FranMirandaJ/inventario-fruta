/**
 * Capitaliza solo la primera letra de una cadena de texto.
 * Ejemplo: "hola mUndo" -> "Hola mundo"
 */
export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return "";
  const cleanText = text.trim();
  return cleanText.charAt(0).toUpperCase() + cleanText.slice(1).toLowerCase();
};

/**
 * Capitaliza la primera letra de cada palabra (Title Case).
 * Ejemplo: "el señor de los anillos" -> "El Señor De Los Anillos"
 */
export const capitalizeWords = (text: string): string => {
  if (!text) return "";
  return text
    .trim()
    .toLowerCase()
    .split(/\s+/) // Separa por cualquier cantidad de espacios
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Remueve acentos y diacríticos de un texto.
 * Excelente para normalizar textos antes de guardarlos en base de datos 
 * o para hacer barras de búsqueda insensibles a los acentos.
 * Ejemplo: "CamióN" -> "CamioN"
 */
export const removeAccents = (text: string): string => {
  if (!text) return "";
  return text
    .normalize("NFD") // Separa la letra base de su acento (ej. 'é' se vuelve 'e' + '´')
    .replace(/[\u0300-\u036f]/g, ""); // Elimina el carácter del acento usando Regex
};

/**
 * Remueve acentos, espacios extra y pasa todo a minúsculas.
 * Útil para comparar lo que escribe el usuario en un Combobox contra la base de datos.
 * Ejemplo: "   HéLado de Vainílla  " -> "helado de vainilla"
 */
export const normalizeForSearch = (text: string): string => {
  return removeAccents(text).toLowerCase().trim().replace(/\s+/g, " ");
};

export const obtenerInicialesAvatar = (nombre: string) => {
  if (!nombre) return "US";
  const palabras = nombre.trim().split(/\s+/);

  if (palabras.length >= 2) {
    return (palabras[0][0] + palabras[palabras.length - 1][0]).toUpperCase();
  }
  return nombre.substring(0, 2).toUpperCase();
};