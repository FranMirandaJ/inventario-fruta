import { colors } from "./consoleColors";

const TIME_ZONE = "America/Mazatlan";

export const createLogger = (prefix: string) => {
  const getTime = () =>
    new Date().toLocaleTimeString("es-MX", {
      timeZone: TIME_ZONE,
      hour12: false,
    });

  const format = (color: string, level: string, msg: string) => {
    const hora = getTime();

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

    return `${activeColor}[${prefix}] [${level}] [${hora}] ${resetColor} ${msg}`;
  };

  return {
    info:    (msg: string) => console.info(format(colors.fg.blue, "INFO", msg)),
    success: (msg: string) => console.log(format(colors.fg.green, "OK", msg)),
    warn:    (msg: string) => console.warn(format(colors.fg.yellow, "WARN", msg)),
    error:   (msg: string) => console.error(format(colors.fg.red, "ERROR", msg)),
  };
};
