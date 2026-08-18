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
  SelectLabel,
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
import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/lib/hooks/useCopyToClipboard";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  CrearUsuarioFormSchema,
  type CrearUsuarioFormState,
} from "../_schemas/crear-usuario.schema";

const rolLabels: Record<RolUsuario, string> = {
  ADMIN: "Administrador",
  VENDEDOR: "Vendedor",
};

type UsuarioRawInputs = {
  nombre: string;
  rol: string;
  correo: string;
  password: string;
};

type PropsFormUsuario = {
  mode: "create" | "edit";
  //usuarioId?: number;
  //initialData?: ProductoRawInputs;
  state: CrearUsuarioFormState;
  action: (payload: FormData) => void;
  pending: boolean;
  onSuccess: () => void;
};

export default function FormUsuario({
  mode,
  state,
  action,
  pending,
  onSuccess,
}: PropsFormUsuario) {
  const roles = Object.values(RolUsuario).map((value) => ({
    label: rolLabels[value],
    value,
  }));

  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [passwordCopied, setPasswordCopied] = useState(false);

  const [generatedPassword] = useState(() => generateRandomPassword());
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const processedTimestamp = useRef(state?.timestamp);
  const formId = mode === "create" ? "crear-usuario" : "editar-usuario";

  const getFieldErrors = (field: string) =>
    clientErrors[field] ??
    state?.errors?.[field as keyof typeof state.errors] ??
    undefined;

  const defaultVal = (field: keyof UsuarioRawInputs) => state?.inputs?.[field]; //?? initialData?.[field] ?? "";

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);

    const data = {
      nombre: formData.get("nombre")?.toString() || "",
      rol: formData.get("rol")?.toString() || "",
      correo: formData.get("correo")?.toString() || "",
      password: formData.get("password")?.toString() || "",
    };

    const result = CrearUsuarioFormSchema.safeParse(data);

    if (!result.success) {
      e.preventDefault();
      setClientErrors(
        result.error.flatten((issue) => issue.message).fieldErrors,
      );
      toast.error("Faltan campos por llenar o hay errores.");
      return;
    }

    if (!passwordCopied) {
      e.preventDefault();
      setClientErrors({ password: ["Debes copiar la contraseña antes de continuar."] });
      toast.error("Faltan campos por llenar o hay errores.");
      return;
    }

    setClientErrors({});
    setHasSubmitted(true);
  };

  useEffect(() => {
      if (!state || !hasSubmitted) return;
      if (processedTimestamp.current === state.timestamp) return;
      processedTimestamp.current = state.timestamp;
  
      if (state.success) {
        toast.success(state.message);
        onSuccess();
      } else {
        toast.error(state.message);
      }
    }, [state?.timestamp, onSuccess, hasSubmitted]);

  return (
    <form id={formId} action={action} onSubmit={handleSubmit}>
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
          <Select name="rol">
            <SelectTrigger
              id="rol"
              aria-invalid={!!getFieldErrors("rol")}
              defaultValue={defaultVal("rol")}
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
          <FieldLabel htmlFor="correo">
            Correo electrónico<span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="correo"
            type="email"
            name="correo"
            placeholder="Correo del usuario"
            aria-invalid={!!getFieldErrors("correo")}
            disabled={pending}
            defaultValue={defaultVal("correo")}
          />
          {getFieldErrors("correo") && (
            <FieldError>{getFieldErrors("correo")![0]}</FieldError>
          )}
        </Field>

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
      </FieldGroup>
    </form>
  );
}
