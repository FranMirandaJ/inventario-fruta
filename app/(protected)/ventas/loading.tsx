import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function VentasLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="w-full bg-background border-0 sm:border border-border sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>

        <div className="w-full flex flex-col gap-6">
          {/* ==== FILTROS ==== */}
          <section className="bg-muted/30 border border-border/60 rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end flex-wrap">
              <div className="flex flex-col gap-1 flex-1 sm:min-w-4/10">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-9 w-full" />
              </div>

              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-9 w-full sm:w-37.5" />
              </div>

              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-9 w-full sm:w-37.5" />
              </div>

              <Skeleton className="h-9 w-32 self-start sm:self-end" />
            </div>
          </section>

          {/* ==== CARDS MOBILE ==== */}
          <div className="sm:hidden space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg border bg-card p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-3.5 w-44" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="size-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>

          {/* ==== TABLA DESKTOP ==== */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Nº de Artículos</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="size-8 rounded-md ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ==== PAGINACION ==== */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            <div className="flex items-center justify-start gap-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-9 w-20" />
            </div>

            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="size-9 rounded-md" />
                <Skeleton className="size-9 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
