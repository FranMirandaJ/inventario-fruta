"use client";
import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, Pencil, CheckCircleIcon, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable, { ColumnDef } from "@/components/Datatable";
import type { ProductoRow } from "@/lib/dal/productos";
import type { CategoriaOption } from "@/lib/dal/categorias";
import ModalEditarProducto from "./ModalEditarProducto";
import AlertModalEstadoProducto from "./AlertModalEstadoProducto";

interface Props {
  data: ProductoRow[];
  categorias: CategoriaOption[];
}

export default function TablaProductos({ data, categorias }: Props) {
  const [editingProduct, setEditingProduct] = useState<ProductoRow | null>(
    null,
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [togglingProduct, setTogglingProduct] = useState<ProductoRow | null>(
    null,
  );
  const [toggleModalOpen, setToggleModalOpen] = useState(false);

  const categoriasOptions = useMemo(() => {
    const todosLosNombres = data.map((p: ProductoRow) => p.categoria_nombre);
    const nombresSinRepetir = [...new Set(todosLosNombres)];
    return nombresSinRepetir.map((nombre) => ({ value: nombre, label: nombre }));
  }, [data]);

  const columns = useMemo<ColumnDef<ProductoRow>[]>(() => [
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
      formatter: "capitalize",
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
      renderCell: (p: ProductoRow) => (
        <div className="flex items-center flex-wrap gap-2">
          <Button
            variant="outline"
            size="icon"
            className="hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/40 dark:hover:text-green-400"
            title="Editar"
            onClick={() => { setEditingProduct(p); setEditModalOpen(true); }}
          >
            <Pencil className="size-4" />
          </Button>
          <Button 
            variant="outline"
            size="icon"
            color={p.activo ? "red" : "green"}
            title={p.activo ? "Desactivar" : "Activar"}
            onClick={() => { setTogglingProduct(p); setToggleModalOpen(true); }}
          >
            {p.activo ? (
              <Ban className="size-4" />
            ) : (
              <CheckCircleIcon className="size-4" />
            )}
          </Button>
        </div>
      ),
    },
  ], []);

  return (
    <>
      <DataTable
        titulo="Listado"
        columns={columns}
        data={data}
        //itemsPerPage={10}
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

      <ModalEditarProducto
        product={editingProduct}
        categorias={categorias}
        open={editModalOpen}
        onOpenChange={(open) => {
          if (!open) setEditModalOpen(false);
        }}
      />

      <AlertModalEstadoProducto
        product={togglingProduct}
        open={toggleModalOpen}
        onOpenChange={(open) => {
          if (!open) setToggleModalOpen(false);
        }}
      />

    </>
  );
}
