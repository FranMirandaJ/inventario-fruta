"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { capitalizeFirstLetter, capitalizeWords, normalizeForSearch } from "@/lib/text";
import { formatCurrency } from "@/lib/money";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

export type ColumnDef<T> = {
  header: string;
  accessorKey?: keyof T;
  sortable?: boolean;
  renderCell?: (item: T) => React.ReactNode;
  formatter?: "capitalize" | "capitalize-words" | "currency";
};

function formatCellValue<T>(col: ColumnDef<T>, item: T): React.ReactNode {
  if (col.renderCell) return col.renderCell(item);
  if (!col.accessorKey) return "";

  const raw = item[col.accessorKey];

  switch (col.formatter) {
    case "capitalize":
      return capitalizeFirstLetter(String(raw ?? ""));
    case "capitalize-words":
      return capitalizeWords(String(raw ?? ""));
    case "currency":
      return formatCurrency(Number(raw) || 0);
    default:
      return String(raw ?? "");
  }
}

interface DataTableProps<T> {
  titulo?: string;
  columns: ColumnDef<T>[];
  data: T[];
  itemsPerPage?: number;
  searchableColumns?: Array<{
    accessorKey: keyof T;
    title: string;
    type?: "text" | "select" | "combobox";
    options?: Array<{ value: string; label: string }>;
  }>;
}

export default function DataTable<T>({
  titulo,
  columns,
  data,
  itemsPerPage = 5,
  searchableColumns = [],
}: DataTableProps<T>) {
  const [filtros, setFiltros] = useState<Partial<Record<keyof T, string>>>({});
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return Object.entries(filtros).every(([key, value]) => {
        if (!value) return true;
        const itemValue = normalizeForSearch(String(item[key as keyof T] ?? ""));
        return itemValue.includes(normalizeForSearch(value as string));
      });
    });
  }, [data, filtros]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortConfig.direction === "asc" ? valA - valB : valB - valA;
      }
      const strA = String(valA ?? "").toLowerCase();
      const strB = String(valB ?? "").toLowerCase();
      if (strA < strB) return sortConfig.direction === "asc" ? -1 : 1;
      if (strA > strB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === "asc" ? { key, direction: "desc" } : null;
      }
      return { key, direction: "asc" };
    });
  };

  const handleFilterChange = (key: keyof T, value: string) => {
    setFiltros((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const columnasBuscables = searchableColumns.slice(0, 3);

  return (
    <fieldset className="w-full min-w-0 border border-border rounded-lg p-4 sm:p-6 bg-background shadow-sm">
      {titulo && (
        <legend className="text-sm font-bold text-foreground px-2 uppercase tracking-wide">
          {titulo}
        </legend>
      )}

      {/* --- ZONA DE BÚSQUEDA --- */}
      {columnasBuscables.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-end gap-3 mb-6">
          {columnasBuscables.map((col) => {
            const label = (
              <label
                className={`text-xs text-muted-foreground font-medium ml-1 ${col.type !== "select" ? "invisible" : ""}`}
              >
                {col.title}
              </label>
            );

            let control: React.ReactNode;

            if (col.type === "select") {
              control = (
                <Select
                  value={filtros[col.accessorKey] || "__all__"}
                  onValueChange={(val) =>
                    handleFilterChange(
                      col.accessorKey,
                      val === "__all__" ? "" : val
                    )
                  }
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder={`Filtrar por ${col.title}...`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Todos</SelectItem>
                    {col.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            } else if (col.type === "combobox") {
              const items = col.options || [];
              const currentValue = items.find(
                (o) => o.value === (filtros[col.accessorKey] || "")
              );

              control = (
                <Combobox
                  items={items}
                  itemToStringLabel={(opt: { value: string; label: string }) => opt.label}
                  itemToStringValue={(opt: { value: string; label: string }) => opt.value}
                  value={currentValue ?? null}
                  autoHighlight={true}
                  onValueChange={(opt: { value: string; label: string } | null) =>
                    handleFilterChange(col.accessorKey, opt?.value ?? "")
                  }
                >
                  <ComboboxInput
                    placeholder={`Filtrar por ${col.title}...`}
                    showClear
                    className="w-full text-sm"
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>Sin resultados</ComboboxEmpty>
                    <ComboboxList>
                      {(opt: { value: string; label: string }) => (
                        <ComboboxItem key={opt.value} value={opt}>
                          {opt.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              );
            } else {
              control = (
                <Input
                  placeholder={`Filtrar por ${col.title}...`}
                  value={filtros[col.accessorKey] || ""}
                  onChange={(e) => handleFilterChange(col.accessorKey, e.target.value)}
                  className="w-full"
                />
              );
            }

            return (
              <div key={String(col.accessorKey)} className="flex flex-col gap-0.5 flex-1 min-w-0">
                {label}
                {control}
              </div>
            );
          })}
        </div>
      )}

      {/* --- VISTA ESCRITORIO --- */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-[#00a63d] dark:bg-green-800">
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead
                  key={String(col.accessorKey ?? col.header)}
                  className={`text-white font-semibold py-3 h-auto ${
                    col.sortable ? "cursor-pointer hover:bg-[#008A33] transition-colors dark:hover:bg-green-700" : ""
                  }`}
                  onClick={() => col.sortable && col.accessorKey && handleSort(col.accessorKey)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && col.accessorKey && sortConfig?.key === col.accessorKey && (
                      sortConfig.direction === "asc" ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
                    )}
                    {col.sortable && col.accessorKey && sortConfig?.key !== col.accessorKey && (
                      <div className="size-4"><ChevronsUpDown className="size-4" /></div>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="border-b border-border hover:bg-green-100 bg-background transition-colors dark:hover:bg-green-900/40">
                  {columns.map((col) => (
                    <TableCell key={String(col.accessorKey ?? col.header)} className="py-4 text-muted-foreground">
                      {formatCellValue(col, row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- VISTA MÓVIL (Tarjetas Apiladas) --- */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {paginatedData.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 border rounded-lg bg-muted">
            No se encontraron resultados.
          </div>
        ) : (
          paginatedData.map((row, rowIndex) => (
            <div key={rowIndex} className="border border-border rounded-xl bg-background shadow-sm overflow-hidden">
              {columns.map((col, colIndex) => (
                <div 
                  key={String(col.accessorKey ?? col.header)} 
                  className={`flex gap-4 items-center justify-between p-4 ${colIndex !== columns.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <span className="text-sm font-semibold text-muted-foreground">{col.header}</span>
                  <div className="text-sm text-foreground text-right">
                    {formatCellValue(col, row)}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* --- PAGINACIÓN --- */}
      <div className="flex flex-col items-center gap-2 mt-6">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="size-10 p-0 transition-colors hover:bg-green-50 hover:text-green-700 hover:border-green-600 cursor-pointer dark:hover:bg-green-900/40 dark:hover:text-green-400 dark:hover:border-green-500"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-10 p-0 transition-colors hover:bg-green-50 hover:text-green-700 hover:border-green-600 cursor-pointer dark:hover:bg-green-900/40 dark:hover:text-green-400 dark:hover:border-green-500"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </span>
      </div>
    </fieldset>
  );
}
