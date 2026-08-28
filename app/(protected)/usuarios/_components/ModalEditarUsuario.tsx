"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import { Loader2 } from "lucide-react";
import FormUsuario from "./FormUsuario";
import type { UsuarioActivo } from "@/lib/dal/usuarios";
import { editarUsuario } from "../_actions/editar-usuario.action";
import { useState } from "react";

type Props = {
  usuario: UsuarioActivo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ModalEditarUsuario({
  usuario,
  open,
  onOpenChange,
}: Props) {

  const [pending, setPending] = useState(false);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Editar usuario"
      description={
        <>
          Actualiza los datos del usuario.
          <br />
          Los campos con <span className="text-destructive">*</span> son
          obligatorios.
        </>
      }
      showTriggerButton={false}
      footer={
        <Button type="submit" form="editar-usuario" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Editando...
            </>
          ) : (
            "Editar"
          )}
        </Button>
      }
      headerImgSrc="/edit-user.svg"
      headerImgAlt="Imagen de edición de usuario"
    >
      {usuario && (
        <FormUsuario
          key={usuario.id}
          mode="edit"
          serverAction={editarUsuario}
          onSuccess={() => onOpenChange(false)}
          onPendingChange={setPending}
          idUsuarioAEditar={usuario.id}
          usuarioAEditar={usuario}
        />
      )}
    </Modal>
  );
}
