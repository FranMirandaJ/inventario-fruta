"use client"; 

import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import DataTable, { ColumnDef } from "./../../../components/Datatable"; 

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
    renderCell: (item) => (
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" className="hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/40 dark:hover:text-green-400">
          <Eye className="size-4" />
        </Button>
        <Button variant="outline" size="icon" className="hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/40 dark:hover:text-green-400">
          <Pencil className="size-4" />
        </Button>
        <Button variant="outline" size="icon" className="hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20">
          <Trash2 className="size-4 text-destructive" />
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