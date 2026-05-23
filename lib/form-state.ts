export type FormState<
  TInputs extends Record<string, string> = Record<string, string>,
  TFields extends string = string
> = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<TFields, string[]>>;
  inputs?: TInputs;
  timestamp?: number;
} | undefined;
