// Errores por campo: para cada campo del formulario (TField), una lista
// de mensajes. Es el formato que produce Zod en safeParse().error.flatten().
type ErroresPorCampo<TField extends string = string> = Partial<Record<TField, string[]>>;

// Valores crudos: lo que el usuario escribió, siempre como string.
// Sirven para restaurar el formulario tras un error de validación.
type ValoresCrudos = Record<string, string>;

/**
 * Resultado que toda Server Action debe devolver al usarse con `useActionState`.
 * Termina en `| undefined` porque `useActionState(accion, undefined)` arranca
 * con estado `undefined` (aún no se ha enviado nada).
 *
 * Genéricos:
 * - TInputs: forma de los valores crudos del formulario (todas strings).
 * - TFields: nombres de los campos, para los errores por campo.
 */
export type FormState<
  TInputs extends ValoresCrudos = ValoresCrudos,
  TFields extends string = string
> = {
  /** true = operación completada; false = hubo errores. */
  success: boolean;
  /** Mensaje general para mostrar en un toast. */
  message?: string;
  /** Errores por campo (los genera Zod al fallar safeParse). */
  errors?: ErroresPorCampo<TFields>;
  /** Valores crudos del form para repintarlos tras un error. */
  inputs?: TInputs;
  /** Sello de tiempo: el cliente lo compara para detectar respuestas nuevas. */
  timestamp?: number;
} | undefined;
