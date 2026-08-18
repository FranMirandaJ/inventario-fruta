"use client";

import Modal from "@/components/Modal";
import FormUsuario from "./FormUsuario";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useState, useActionState } from "react";
import { crearUsuario } from "../_actions/crear-usuario";

export default function ModalNuevoUsuario() {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const [state, action, pending] = useActionState(crearUsuario, undefined);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (!isOpen) {
      setFormKey((prev) => prev + 1);
    }
  };

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
      open={open}
      onOpenChange={handleOpenChange}
      footer={
        <Button type="submit" form="crear-usuario" disabled={pending}>
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
      <FormUsuario
        key={formKey}
        mode="create"
        state={state}
        action={action}
        pending={pending}
        onSuccess={() => setOpen(false)}
      />
    </Modal>
  );
}
