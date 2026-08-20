"use client";

import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { RolUsuario } from "@/generated/prisma";
import { generateRandomPassword } from "@/lib/password";
import { rolLabels } from "@/lib/usuarios";
import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/lib/hooks/useCopyToClipboard";
import { useState, useRef, useEffect, useActionState } from "react";
import { toast } from "sonner";
import { CrearUsuarioFormSchema } from "../_schemas/crear-usuario.schema";
import { EditarUsuarioFormSchema } from "../_schemas/editar-usuario.schema";
import { FormState } from "@/lib/form-state";
import type { UsuarioActivo } from "@/lib/dal/usuarios";

type PropsFormUsuario = {
  mode: "create" | "edit";
  serverAction: (prevState: FormState, formData: FormData) => Promise<FormState>;
  onPendingChange?: (pending: boolean) => void;
  onSuccess: () => void;
  idUsuarioAEditar?: number;
  usuarioAEditar?: UsuarioActivo
};

export default function FormUsuario({
  mode,
  serverAction,
  onPendingChange,
  onSuccess,
  idUsuarioAEditar,
  usuarioAEditar,
}: PropsFormUsuario) {
  const [state, action, pending] = useActionState(serverAction, undefined);
  const roles = Object.values(RolUsuario).map((value) => ({
    label: rolLabels[value],
    value,
  }));

  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [passwordCopied, setPasswordCopied] = useState(false);

  const [generatedPassword] = useState(() => generateRandomPassword());
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({});
  const processedTimestamp = useRef(state?.timestamp);
  const formId = mode === "create" ? "crear-usuario" : "editar-usuario";

  const getFieldErrors = (field: string) =>
    clientErrors[field] ??
    state?.errors?.[field as keyof typeof state.errors] ??
    undefined;

  const defaultVal = (field: keyof UsuarioActivo) => state?.inputs?.[field] ?? usuarioAEditar?.[field] ?? "";

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);

    const data = {
      nombre: formData.get("nombre")?.toString() || "",
      rol: formData.get("rol")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      password: formData.get("password")?.toString() || "",
    };

    const schema = mode === "create" ? CrearUsuarioFormSchema : EditarUsuarioFormSchema;
    const result = schema.safeParse(data);

    if (!result.success) {
      e.preventDefault();
      setClientErrors(result.error.flatten((issue) => issue.message).fieldErrors);
      toast.error("Faltan campos por llenar o hay errores.");
      return;
    }

    if (mode === "create" && !passwordCopied) {
      e.preventDefault();
      setClientErrors({ password: ["Debes copiar la contraseña antes de continuar."] });
      toast.error("Faltan campos por llenar o hay errores.");
      return;
    }

    setClientErrors({});
  };

  useEffect(() => {
    onPendingChange?.(pending);
  }, [pending, onPendingChange]);

  useEffect(() => {
      if (!state?.timestamp) return;
      if (processedTimestamp.current === state.timestamp) return;
      processedTimestamp.current = state.timestamp;
  
      if (state.success) {
        toast.success(state.message);
        onSuccess();
      } else {
        toast.error(state.message);
      }
    }, [state?.timestamp, onSuccess]);

  return (
    <form id={formId} action={action} onSubmit={handleSubmit}>
      {mode === "edit" && <input type="hidden" name="id_usuario_a_editar" value={idUsuarioAEditar} />}
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="nombre">
            Nombre<span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="nombre"
            type="text"
            name="nombre"
            placeholder="Nombre del usuario"
            aria-invalid={!!getFieldErrors("nombre")}
            disabled={pending}
            defaultValue={defaultVal("nombre")}
          />
          {getFieldErrors("nombre") && (
            <FieldError>{getFieldErrors("nombre")![0]}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="rol">
            Rol<span className="text-destructive">*</span>
          </FieldLabel>
          <Select name="rol" defaultValue={String(defaultVal("rol")) || undefined}>
            <SelectTrigger
              id="rol"
              aria-invalid={!!getFieldErrors("rol")}
            >
              <SelectValue placeholder="Seleccione un rol" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                {roles.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {getFieldErrors("rol") && (
            <FieldError>{getFieldErrors("rol")![0]}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">
            Correo electrónico<span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="Correo del usuario"
            aria-invalid={!!getFieldErrors("email")}
            disabled={pending}
            defaultValue={defaultVal("email")}
          />
          {getFieldErrors("email") && (
            <FieldError>{getFieldErrors("email")![0]}</FieldError>
          )}
        </Field>

        {mode === "create" && (
          <Field>
            <FieldLabel htmlFor="password">
              Contraseña<span className="text-destructive">*</span>
            </FieldLabel>
            <FieldDescription>
              Contraseña generada automáticamente. Cópiala antes de crear el
              usuario, ya que no podrá verse después.
            </FieldDescription>

            <InputGroup>
              <InputGroupInput
                id="password"
                name="password"
                value={generatedPassword}
                readOnly
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  aria-label="Copiar contraseña"
                  title="Copiar contraseña"
                  size="icon-xs"
                  aria-invalid={!!getFieldErrors("password")}
                  onClick={() => {
                    copyToClipboard(generatedPassword);
                    setPasswordCopied(true);
                    setClientErrors(prev => {
                      const next = { ...prev };
                      delete next.password;
                      return next;
                    });
                  }}
                >
                  {copiedText ? <Check /> : <Copy />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {getFieldErrors("password") && (
              <FieldError>{getFieldErrors("password")![0]}</FieldError>
            )}
          </Field>
        )}

      </FieldGroup>
    </form>
  );
}
