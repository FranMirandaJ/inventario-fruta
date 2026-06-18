import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, ArrowRight, RotateCcw } from "lucide-react";

export default function TablaVentas({}) {
  return (
    <div className="w-full">


        <div className="flex-1 min-w-0 bg-muted/30 border border-border/60 rounded-xl p-4 sm:p-5">
          <section className="flex flex-col sm:flex-row gap-4 sm:items-end flex-wrap">

            <div className="flex flex-col gap-1 sm:min-w-4/10 flex-1">
              <label className="text-xs font-semibold uppercase tracking-wider ml-1">
                Buscar
              </label>
              <div className="relative mt-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none" />
                <Input
                  placeholder="Por vendedor..."
                  className="bg-background pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 w-full sm:w-auto">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider ml-1">
                  Desde
                </label>
                  <Input
                    type="date"
                    className="bg-background w-full sm:w-37.5"
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
                  />
              </div>
            </div>

            <Button
              variant="ghost"
              className="gap-2 self-start sm:self-end w-full sm:w-auto text-muted-foreground hover:text-primary-foreground hover:bg-primary transition-colors"
            >
              <RotateCcw className="size-4" />
              Limpiar filtros
            </Button>

          </section>
        </div>
      
    </div>
  );
}
