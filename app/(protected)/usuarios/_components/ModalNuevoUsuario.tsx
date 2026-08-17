"use client";

import Modal from "@/components/Modal";
import FormUsuario from "./FormUsuario";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";

export default function ModalNuevoUsuario() {
  const [pending, setPending] = useState(false);

  return (
    <Modal
      title="Crear usuario"
      description={
        <>
          Agrega un nuevo usuario para acceder al sistema.
          <br />
          Los campos con <span className="text-destructive">*</span> son
          obligatorios.
        </>
      }
      textTriggerButton="Nuevo"
      iconTriggerButton={<Plus className="size-4" />}
      triggerButtonVariant="default"
      headerImgSrc="/new-user.svg"
      footer={
        <Button type="submit" form="crear-producto" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar"
          )}
        </Button>
      }
    >
      <FormUsuario />
    </Modal>
  );
}
