"use client";
import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable, { ColumnDef } from "@/components/Datatable";
import type { ProductoRow } from "@/lib/dal/productos";
import type { CategoriaOption } from "@/lib/dal/categorias";
import ModalEditarProducto from "./ModalEditarProducto";

interface Props {
  data: ProductoRow[];
  categorias: CategoriaOption[];
}

const columns: ColumnDef<ProductoRow>[] = [
  {
    header: "Nombre",
    accessorKey: "nombre",
    sortable: true,
    formatter: "capitalize",
  },
  {
    header: "Categoría",
    accessorKey: "categoria_nombre",
    sortable: true,
    formatter: "capitalize-words",
  },
  {
    header: "Precio",
    accessorKey: "precio",
    sortable: true,
    formatter: "currency",
  },
  { header: "Stock", accessorKey: "stock_actual", sortable: true },
  {
    header: "Estado",
    accessorKey: "activo",
    sortable: true,
    renderCell: (p) =>
      p.activo ? (
        <CheckCircle2 className="size-5 text-green-600" />
      ) : (
        <XCircle className="size-5 text-red-600" />
      ),
  },
  {
    header: "Acciones",
    accessorKey: "id",
    renderCell: (p) => (
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          className="hover:bg-slate-200"
          size="icon"
          onClick={() => {}}
        >
          <Pencil className="size-4 text-slate-700" />
        </Button>
        <Button
          variant="outline"
          className="hover:bg-red-200"
          size="icon"
          onClick={() => {}}
        >
          <Trash2 className="size-4 text-red-500" />
        </Button>
      </div>
    ),
  },
];

export default function TablaProductos({ data, categorias }: Props) {
  const [editingProduct, setEditingProduct] = useState<ProductoRow | null>(null);

  const categoriasOptions = useMemo(() => {
    const unique = [...new Set(data.map((p) => p.categoria_nombre))];
    return unique.map((c) => ({ value: c, label: c }));
  }, [data]);

  const columnsWithEdit: ColumnDef<ProductoRow>[] = columns.map((col) => {
    if (col.accessorKey === "id" && col.renderCell) {
      const originalRender = col.renderCell;
      return {
        ...col,
        renderCell: (p: ProductoRow) => (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              className="hover:bg-slate-200"
              size="icon"
              onClick={() => setEditingProduct(p)}
            >
              <Pencil className="size-4 text-slate-700" />
            </Button>
            <Button
              variant="outline"
              className="hover:bg-red-200"
              size="icon"
              onClick={() => {}}
            >
              <Trash2 className="size-4 text-red-500" />
            </Button>
          </div>
        ),
      };
    }
    return col;
  });

  return (
    <>
      <DataTable
        titulo="Listado"
        columns={columnsWithEdit}
        data={data}
        itemsPerPage={10}
        searchableColumns={[
          { accessorKey: "nombre", title: "Nombre", type: "text" },
          {
            accessorKey: "categoria_nombre",
            title: "Categoría",
            type: "combobox",
            options: categoriasOptions,
          },
          {
            accessorKey: "activo",
            title: "Estado",
            type: "select",
            options: [
              { value: "true", label: "Activo" },
              { value: "false", label: "Inactivo" },
            ],
          },
        ]}
      />

      {editingProduct && (
        <ModalEditarProducto
          product={editingProduct}
          categorias={categorias}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingProduct(null);
          }}
        />
      )}

    </>
  );
}
