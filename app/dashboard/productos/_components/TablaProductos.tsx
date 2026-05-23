"use client";
import { useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import DataTable, { ColumnDef } from "@/components/Datatable";
import type { ProductoRow } from "@/lib/dal/productos";

interface Props {
  data: ProductoRow[];
}

const columns: ColumnDef<ProductoRow>[] = [
  { header: "Nombre", accessorKey: "nombre", sortable: true, formatter: "capitalize" },
  { header: "Categoría", accessorKey: "categoria_nombre", sortable: true, formatter: "capitalize-words" },
  { header: "Precio", accessorKey: "precio", sortable: true, formatter: "currency" },
  { header: "Stock", accessorKey: "stock_actual", sortable: true },
  {
    header: "Activo",
    accessorKey: "activo",
    sortable: true,
    renderCell: (p) => (
      p.activo
        ? <CheckCircle2 className="size-5 text-green-600" />
        : <XCircle className="size-5 text-red-600" />
    ),
  },
];

export default function TablaProductos({ data }: Props) {
  const categoriasOptions = useMemo(() => {
    const unique = [...new Set(data.map((p) => p.categoria_nombre))];
    return unique.map((c) => ({ value: c, label: c }));
  }, [data]);

  return (
    <DataTable
      titulo="Listado"
      columns={columns}
      data={data}
      itemsPerPage={10}
      searchableColumns={[
        { accessorKey: "nombre", title: "Nombre" },
        {
          accessorKey: "categoria_nombre",
          title: "Categoría",
          type: "combobox",
          options: categoriasOptions,
        },
        {
          accessorKey: "activo",
          title: "Activo",
          type: "select",
          options: [
            { value: "true", label: "Activo" },
            { value: "false", label: "Inactivo" },
          ],
        },
      ]}
    />
  );
}
