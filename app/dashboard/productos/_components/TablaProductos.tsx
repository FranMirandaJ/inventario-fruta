// "use client";
// import DataTable, { ColumnDef } from "@/components/Datatable";
// import type { ProductoConCategoria } from "@/lib/dal/productos";

// interface Props {
//   data: ProductoConCategoria[];
// }

// const columns: ColumnDef<ProductoRow>[] = [
//   { header: "Nombre", accessorKey: "nombre", sortable: true },
//   { header: "Presentación", accessorKey: "presentacion", sortable: true },
//   {
//     header: "Precio",
//     accessorKey: "precio",
//     sortable: true,
//     renderCell: (item) => `$${item.precio.toFixed(2)}`,
//   },
//   { header: "Stock Actual", accessorKey: "stock_actual", sortable: true },
//   { header: "Stock Mínimo", accessorKey: "stock_minimo", sortable: true },
//   {
//     header: "Categoría",
//     accessorKey: "categoriaNombre",
//     sortable: true,
//   },
// ];

// export default function TablaProductos({ data }: Props) {
//   return (
//     <DataTable
//       titulo="Listado de Productos"
//       columns={columns}
//       data={data}
//       itemsPerPage={10}
//       searchableColumns={[
//         { accessorKey: "nombre", title: "Nombre" },
//         { accessorKey: "categoriaNombre", title: "Categoría" },
//       ]}
//     />
//   );
// }