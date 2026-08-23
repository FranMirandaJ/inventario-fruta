"use client";

import type { UsuarioActivo } from "@/lib/dal/usuarios";
import DataTable, { ColumnDef } from "@/components/Datatable";
import { Button } from "@/components/ui/button";
import { Pencil, UserXIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { rolLabels } from "@/lib/usuarios";
import { useSession } from "@/lib/contexts/session-context";
import BotonPermiso from "@/components/BotonPermiso";
import { PERMISOS } from "@/lib/permisos";

const ModalEditarUsuario = dynamic(() => import("./ModalEditarUsuario"));
const AlertModalDeshabilitarUsuario = dynamic(() => import("./AlertModalDeshabilitarUsuario"));
interface Props {
  data: UsuarioActivo[];
}

export default function TablaUsuarios({ data }: Props) {

  const currentSession = useSession();

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UsuarioActivo | null>(null);

  const [disableAlertOpen, setDisableAlertOpen] = useState<boolean>(false);
  const [disablingUser, setDisablingUser] = useState<UsuarioActivo | null>(null);

  const columns: ColumnDef<UsuarioActivo>[] = [
    {
      header: "Nombre",
      accessorKey: "nombre",
      sortable: true,
      formatter: "capitalize-words",
    },
    {
      header: "Correo",
      accessorKey: "email",
      sortable: true,
    },
    {
      header: "Rol",
      accessorKey: "rol",
      sortable: true,
      renderCell: (u: UsuarioActivo) => {
        return (rolLabels[u.rol]);
      }
    },
    {
      header: "Acciones",
      renderCell: (u: UsuarioActivo) => {
        const esMismoUsuario = Number(currentSession.id_usuario) === u.id;
        return (
          <div className="flex items-center flex-wrap gap-2">
            <BotonPermiso
              permiso={PERMISOS.usuariosEditar}
              variant="outline"
              size="icon"
              color="blue"
              title="Editar"
              onClick={() => {
                setEditingUser(u);
                setEditModalOpen(true);
              }}
            >
              <Pencil className="size-4" />
            </BotonPermiso>
            {esMismoUsuario ? (
              <Button
                variant="outline"
                size="icon"
                color="default"
                disabled={true}
              >
                <UserXIcon className="size-4" />
              </Button>
            ) : (
              <BotonPermiso
                permiso={PERMISOS.usuariosDeshabilitar}
                variant="outline"
                size="icon"
                color="red"
                title="Deshabilitar"
                onClick={() => {
                  setDisablingUser(u);
                  setDisableAlertOpen(true);
                }}
              >
                <UserXIcon className="size-4" />
              </BotonPermiso>
            )}
          </div>
        );
      }
    },
  ];

  

  return (
    <>
      <DataTable
        titulo="Listado"
        columns={columns}
        data={data}
        searchableColumns={[
          { accessorKey: "nombre", title: "Nombre", type: "text" },
          { accessorKey: "email", title: "Correo", type: "text" },
        ]}
      />

      <ModalEditarUsuario
        open={editModalOpen}
        onOpenChange={(open) => {
          if (!open) setEditModalOpen(false);
        }}
        usuario={editingUser}
      />

      <AlertModalDeshabilitarUsuario
        usuario={disablingUser}
        open={disableAlertOpen}
        onOpenChange={setDisableAlertOpen}
      />

    </>
  );
}
