"use client";

import Modal from "@/components/Modal";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import type { UsuarioActivo } from "@/lib/dal/usuarios";
import { capitalizeWords } from "@/lib/text";
import { rolLabels } from "@/lib/permisos";
import { useActionState, useState, useEffect, useRef } from "react";
import { regenerarPassword } from "../_actions/regenerar-password.action";
import { Copy, Check, Loader2 } from "lucide-react";
import { generateRandomPassword } from "@/lib/password";
import { useCopyToClipboard } from "@/lib/hooks/useCopyToClipboard";
import { RegenerarPasswordFormSchema } from "../_schemas/regenerar-password.schema";
import { toast } from "sonner";

type Props = {
  usuario: UsuarioActivo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ModalRegenerarPassword({
  open,
  onOpenChange,
  usuario,
}: Props) {
  const [pending, setPending] = useState(false);

  return (
    <Modal
      title="Regenerar contraseña"
      description={
        <>
          Genera una nueva contraseña aleatoria y segura para el usuario.
          Cópiala y compártela de forma segura, ya que no se mostrará de nuevo.
        </>
      }
      open={open}
      onOpenChange={onOpenChange}
      headerImgSrc="/keys.svg"
      showTriggerButton={false}
      footer={
        <Button type="submit" form="regenerar-password" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Regenerando...
            </>
          ) : (
            "Regenerar"
          )}
        </Button>
      }
    >
      {usuario && (
        <ContenidoRegenerarPassword
          usuario={usuario}
          onPendingChange={setPending}
          onOpenChange={onOpenChange}
        />
      )}
    </Modal>
  );
}

function ContenidoRegenerarPassword({
  usuario,
  onPendingChange,
  onOpenChange,
}: {
  usuario: UsuarioActivo;
  onPendingChange?: (pending: boolean) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [state, action, pending] = useActionState(
    regenerarPassword.bind(null, usuario.id),
    undefined,
  );

  useEffect(() => {
    onPendingChange?.(pending);
  }, [pending, onPendingChange]);

  const processedTimestamp = useRef(state?.timestamp);

  useEffect(() => {
    if (!state?.timestamp) return;
    if (processedTimestamp.current === state.timestamp) return;
    processedTimestamp.current = state.timestamp;

    if (state.success) {
      toast.success(state.message);
      onOpenChange(false);
    } else {
      toast.error(state.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.timestamp, onOpenChange]);

  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({});

  const [generatedPassword] = useState(() => generateRandomPassword());

  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [passwordCopied, setPasswordCopied] = useState(false);

  const getFieldErrors = (field: string) =>
    clientErrors[field] ??
    state?.errors?.[field as keyof typeof state.errors] ??
    undefined;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const data = { password: formData.get("password")?.toString() || "" };
    const result = RegenerarPasswordFormSchema.safeParse(data);

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
      setClientErrors({
        password: ["Debes copiar la contraseña antes de continuar."],
      });
      toast.error("Faltan campos por llenar o hay errores.");
      return;
    }

    setClientErrors({});
  };

  return (
    <>
      <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm space-y-3">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-muted-foreground text-xs sm:text-sm">
            Nombre
          </span>
          <span className="font-medium wrap-break-word min-w-0">
            {capitalizeWords(usuario.nombre)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-muted-foreground text-xs sm:text-sm">
            Correo
          </span>
          <span className="text-xs font-medium wrap-break-word min-w-0">
            {usuario.email}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-muted-foreground text-xs sm:text-sm">Rol</span>
          <span className="font-medium">{rolLabels[usuario.rol]}</span>
        </div>
      </div>
      <form
        id="regenerar-password"
        action={action}
        onSubmit={handleSubmit}
        className="mt-5"
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="password">
              Nueva contraseña<span className="text-destructive">*</span>
            </FieldLabel>
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
                    setClientErrors((prev) => {
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
    </>
  );
}
