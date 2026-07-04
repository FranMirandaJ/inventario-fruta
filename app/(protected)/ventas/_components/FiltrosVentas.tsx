"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, ArrowRight, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";

export default function FiltrosVentas() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQ = searchParams.get("q") || "";
  const currentDesde = searchParams.get("desde") || "";
  const currentHasta = searchParams.get("hasta") || "";

  const [searchText, setSearchText] = useState(currentQ);

  useEffect(() => {
    setSearchText(currentQ);
  }, [currentQ]);

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    params.delete("page");
    if (params.has("desde") || params.has("hasta")) {
      params.set("offset", String(new Date().getTimezoneOffset()));
    } else {
      params.delete("offset");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    updateParams({ q: term || undefined });
  }, 300);

  const handleDesde = (value: string) => {
    updateParams({ desde: value || undefined });
  };

  const handleHasta = (value: string) => {
    updateParams({ hasta: value || undefined });
  };

  const limpiarFiltros = () => {
    const params = new URLSearchParams();
    if (searchParams.has("pageSize")) {
      params.set("pageSize", searchParams.get("pageSize")!);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <section className="flex-1 min-w-0 bg-muted/30 border border-border/60 rounded-xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-end flex-wrap">
        <div className="flex flex-col gap-1 sm:min-w-4/10 flex-1">
          <label className="text-xs font-semibold uppercase tracking-wider ml-1">
            Buscar
          </label>
          <div className="relative mt-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none" />
            <Input
              placeholder="Por vendedor..."
              className="bg-background pl-10"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                handleSearch(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row items-stretch sm:items-end w-full sm:w-auto">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider ml-1">
              Desde
            </label>
            <Input
              type="date"
              className="bg-background w-full sm:w-37.5"
              value={currentDesde}
              onChange={(e) => handleDesde(e.target.value)}
            />
          </div>

          <div className="hidden sm:flex items-center h-10">
            <ArrowRight className="size-4 text-muted-foreground shrink-0" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-inherit uppercase tracking-wider ml-1">
              Hasta
            </label>
            <Input
              type="date"
              className="bg-background w-full sm:w-37.5 focus-visible:ring-[#00a63d]"
              value={currentHasta}
              onChange={(e) => handleHasta(e.target.value)}
            />
          </div>
        </div>

        <Button
          variant="ghost"
          className="gap-2 self-start sm:self-end w-full sm:w-auto text-muted-foreground hover:text-primary-foreground hover:bg-primary transition-colors"
          onClick={limpiarFiltros}
        >
          <RotateCcw className="size-4" />
          Limpiar filtros
        </Button>
      </div>
    </section>
  );
}
