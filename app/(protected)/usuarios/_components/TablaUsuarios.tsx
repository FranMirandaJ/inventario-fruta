"use client";

import type { UsuarioActivo } from "@/lib/dal/usuarios";
import DataTable, { ColumnDef } from "@/components/Datatable";

interface Props {
  data: UsuarioActivo[];
}

export default function TablaUsuarios({ data }: Props) {
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
    </>
  );
}
