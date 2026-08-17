/**
 * Genera una contraseña aleatoria segura usando CSPRNG del navegador.
 * Excluye caracteres ambiguos (0, O, I, l, 1) para facilitar la lectura.
 *
 * @param longitud - Cantidad de caracteres (default: 12)
 * @returns Contraseña con letras, números y símbolos (.,_-!@#%&*+?)
 */
export const generateRandomPassword = (longitud = 12) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789.,_-!@#%&*+?";
  const array = new Uint8Array(longitud);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => chars[b % chars.length]).join("");
};
