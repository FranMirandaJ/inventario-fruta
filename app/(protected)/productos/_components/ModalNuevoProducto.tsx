"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import { Plus, Loader2 } from "lucide-react";
import type { CategoriaOption } from "@/lib/dal/categorias";
import { useActionState, useState } from "react";
import { crearProducto } from "../_actions/crear-producto.action";
import FormProducto from "./FormProducto";
import { PERMISOS } from "@/lib/permisos";

type Props = {
  categorias: CategoriaOption[];
};

export default function ModalNuevoProducto({
  categorias,
}: Props) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [state, action, pending] = useActionState(crearProducto, undefined);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (!isOpen) {
      setFormKey((prev) => prev + 1);
    }
  };

  return (
    <Modal
      title="Nuevo producto"
      description={<>Agrega un nuevo producto a tu inventario.<br/>Los campos con <span className="text-destructive">*</span> son obligatorios.</>}
      textTriggerButton="Nuevo"
      iconTriggerButton={<Plus className="size-4" />}
      triggerButtonVariant="default"
      triggerButtonPermiso={PERMISOS.productosCrear}
      open={open}
      onOpenChange={handleOpenChange}
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
      headerImgSrc="/icecream.svg"
    >
      <FormProducto
        key={formKey}
        mode="create"
        categorias={categorias}
        state={state}
        action={action}
        pending={pending}
        onSuccess={() => setOpen(false)}
      />
    </Modal>
  );
}
