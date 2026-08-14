import { colors } from "./consoleColors";

const TIME_ZONE = "America/Mazatlan";

export const createLogger = (prefix: string) => {
  const getDateTime = () =>
    new Date().toLocaleString("es-MX", {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

  const getTag = (color: string, level: string) => {
    const fechaHora = getDateTime();
    /* * process.env.NODE_ENV indica el entorno de ejecución actual de Node.js.
     * - En la nube (AWS, Vercel, etc.) siempre se fuerza automáticamente a "production".
     * - En Next.js local (pnpm dev) vale "development".
     * - En scripts aislados (como el seed de Prisma) suele ser 'undefined'.
     * Por lo tanto, si NO es explícitamente "production", asumimos que estamos 
     * en local y encendemos los colores para la terminal.
     */
    const useColors = process.env.NODE_ENV !== "production"; 

    const activeColor = useColors ? color : "";
    const resetColor = useColors ? colors.reset : "";

    return `${activeColor}[${prefix}] [${level}] [${fechaHora}]${resetColor}`;
  };

  return {
    info:    (...args: unknown[]) => console.info(getTag(colors.fg.blue, "INFO"), ...args),
    success: (...args: unknown[]) => console.log(getTag(colors.fg.green, "OK"), ...args),
    warn:    (...args: unknown[]) => console.warn(getTag(colors.fg.yellow, "WARN"), ...args),
    error:   (...args: unknown[]) => console.error(getTag(colors.fg.red, "ERROR"), ...args),
  };
};
