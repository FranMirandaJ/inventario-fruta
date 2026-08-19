type PrismaError = { code: string; meta?: unknown };

export function isPrismaError(error: unknown): error is PrismaError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as PrismaError).code === "string" &&
    (error as PrismaError).code.startsWith("P")
  );
}