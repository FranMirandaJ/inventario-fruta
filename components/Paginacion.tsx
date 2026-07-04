"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function Paginacion({
  totalPages,
}: {
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Number(searchParams.get("pageSize")) || 5;

  const createPageURL = (page: number, ps?: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    if (ps) params.set("pageSize", String(ps));
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    router.replace(createPageURL(page));
  };

  const handlePageSizeChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("pageSize", value);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-center sm:justify-end gap-4 mt-7">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Registros por página
        </label>
        <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-7">
      <div className="flex items-center justify-start gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Registros por página
        </label>
        <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Página {currentPage} de {totalPages}
        </span>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={createPageURL(currentPage - 1)}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
                aria-disabled={currentPage <= 1}
                tabIndex={currentPage <= 1 ? -1 : undefined}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href={createPageURL(currentPage + 1)}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) handlePageChange(currentPage + 1);
                }}
                aria-disabled={currentPage >= totalPages}
                tabIndex={currentPage >= totalPages ? -1 : undefined}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
