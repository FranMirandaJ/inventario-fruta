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
    return `${color}[${prefix}] [${level}] [${hora}] ${colors.reset} ${msg}`;
  };

  return {
    info:    (msg: string) => console.info(format(colors.fg.blue, "INFO", msg)),
    success: (msg: string) => console.log(format(colors.fg.green, "OK", msg)),
    warn:    (msg: string) => console.warn(format(colors.fg.yellow, "WARN", msg)),
    error:   (msg: string) => console.error(format(colors.fg.red, "ERROR", msg)),
  };
};
