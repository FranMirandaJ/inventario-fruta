"use client";

import { Button } from "@/components/ui/button";
import { Eye, Pencil, Ban, Trash2, CheckCircleIcon } from "lucide-react";
import DataTable, { ColumnDef } from "../../../components/Datatable";

export interface Periodo {
  id: string;
  periodoEscolar: string;
  totalEventos: number;
  totalHoras: number;
}

const misColumnas: ColumnDef<Periodo>[] = [
  {
    header: "Periodo Escolar",
    accessorKey: "periodoEscolar",
    sortable: true,
  },
  {
    header: "Total de Eventos",
    accessorKey: "totalEventos",
    sortable: true,
  },
  {
    header: "Total de Horas",
    accessorKey: "totalHoras",
    sortable: true,
  },
  {
    header: "Acciones",
    accessorKey: "id",
    renderCell: () => (
      <div className="flex items-center gap-1 flex-wrap">
        <Button variant="outline" size="icon" color="blue" title="Ver detalles">
          <Eye className="size-4" />
        </Button>
        <Button variant="outline" size="icon" color="green" title="Activar">
          <CheckCircleIcon className="size-4" />
        </Button>
        <Button variant="outline" size="icon" color="red" title="Desactivar">
          <Ban className="size-4" />
        </Button>
        <Button variant="outline" size="icon" title="Editar">
          <Pencil className="size-4" />
        </Button>
        <Button variant="outline" size="icon" color="red" title="Eliminar">
          <Trash2 className="size-4" />
        </Button>
      </div>
    ),
  },
];

export default function TablaPeriodos({ data }: { data: Periodo[] }) {
  return (
    <DataTable
      titulo="Listado de Periodos"
      columns={misColumnas}
      data={data}
      itemsPerPage={5}
      searchableColumns={[
        { accessorKey: "periodoEscolar", title: "Periodo Escolar" },
        { accessorKey: "totalEventos", title: "Total de Eventos" },
      ]}
    />
  );
}
