"use client"; 

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
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
      <Button variant="outline" size="sm" className="bg-white text-blue-600 border-blue-200 hover:bg-blue-50">
        <Eye className="mr-2 size-4" />
        Ver
      </Button>
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