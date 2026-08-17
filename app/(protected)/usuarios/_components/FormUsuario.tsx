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
import { useState } from "react";

const rolLabels: Record<RolUsuario, string> = {
  ADMIN: "Administrador",
  VENDEDOR: "Vendedor",
};

export default function FormUsuario({}) {

  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [generatedPassword] = useState(() => generateRandomPassword());

  const roles = Object.values(RolUsuario).map((value) => ({
    label: rolLabels[value],
    value,
  }));

  return (
    <form action="">
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
            //aria-invalid={!!getFieldErrors("nombre")}
            //disabled={pending}
            //defaultValue={defaultVal("nombre")}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="rol">
            Rol<span className="text-destructive">*</span>
          </FieldLabel>
          <Select>
            <SelectTrigger id="rol" name="rol">
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
            //aria-invalid={!!getFieldErrors("nombre")}
            //disabled={pending}
            //defaultValue={defaultVal("nombre")}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">
            Contraseña<span className="text-destructive">*</span>
          </FieldLabel>
          <FieldDescription>
            Contraseña generada automáticamente. Cópiala antes de crear el usuario, ya que no podrá verse después.
          </FieldDescription>

          <InputGroup>
            <InputGroupInput id="password" value={generatedPassword} readOnly/>
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                aria-label="Copiar contraseña"
                title="Copiar contraseña"
                size="icon-xs"
                onClick={() => {
                  copyToClipboard(generatedPassword);
                }}
              >
                {copiedText ? <Check /> : <Copy />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </FieldGroup>
    </form>
  );
}
