"use client";

import type { UsuarioActivo } from "@/lib/dal/usuarios";
import DataTable, { ColumnDef } from "@/components/Datatable";
import ModalEditarUsuario from "./ModalEditarUsuario";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";

interface Props {
  data: UsuarioActivo[];
}

export default function TablaUsuarios({ data }: Props) {

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UsuarioActivo | null>(null);

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
      formatter: "capitalize",
    },
    {
      header: "Acciones",
      renderCell: (u: UsuarioActivo) => (
        <div className="flex items-center flex-wrap gap-2">
          <Button
            variant="outline"
            size="icon"
            color="purple"
            title="Editar"
            onClick={() => {
              setEditingUser(u);
              setEditModalOpen(true);
            }}
          >
            <Pencil className="size-4" />
          </Button>
        </div>
      ),
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

    </>
  );
}
