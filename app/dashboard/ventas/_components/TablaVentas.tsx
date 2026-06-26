"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, ArrowRight, RotateCcw } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


function CardVenta({}) {
  return (
    // <div className="rounded-lg border bg-white transition-colors duration-200 hover:bg-muted/30">
    //   <div className="flex items-center justify-between px-4 py-2.5">
    //     <div className="space-y-1.5 text-left">
    //       <h4 className="text-md font-semibold leading-none">
    //         Pulpa de fresa
    //       </h4>

    //       <div className="text-sm text-muted-foreground leading-none">
    //         Pulpa de Fruta <strong>x1</strong> por Francisco Miranda
    //       </div>

    //       <p className="text-sm text-muted-foreground leading-none">
    //         Hoy, 9:49 PM
    //       </p>
    //     </div>

    //     <span className="text-base font-bold text-green-600">
    //       $15.00
    //     </span>
    //   </div>
    // </div>
    <Accordion
      type="single"
      collapsible
      defaultValue="1"
      className=" rounded-lg border bg-white"
    >
      <AccordionItem value="1" className="rounded-lg border-none transition-colors duration-200 hover:bg-muted/30">
        <AccordionTrigger className="items-start px-4 py-2.5 hover:no-underline">
          <div className="flex w-full items-start justify-between ">
            <div className="space-y-1.5 text-left">
              <h4 className="text-md font-semibold leading-none">
                2 productos
              </h4>

              <p className="text-sm text-muted-foreground leading-none">
                2 artículos por Administrador
              </p>

              <p className="text-sm text-muted-foreground leading-none">
                Hoy, 8:38 PM
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-green-600">
                $20
              </span>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="border-t px-4 py-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Pulpa de Fresa</span>

              <span className="text-muted-foreground">
                x1 = $15
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Boli de Fresa</span>

              <span className="text-muted-foreground">
                x1 = $5
              </span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default function TablaVentas({}) {
  return (
    <div className="w-full">
      {/* ======= SECTION DE FILTRADOS ======= */}
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
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row items-stretch sm:items-end w-full sm:w-auto">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider ml-1">
                Desde
              </label>
              <Input type="date" className="bg-background w-full sm:w-37.5" />
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
        </div>
      </section>

      {/* ======= SECTION DE CARD LIST (MOBILE) ======= */}
      <section className="sm:hidden mt-8">
        <CardVenta />
      </section>

      {/* ======= SECTION DE TABLA (DESKTOP) ======= */}
      {/* <section>

      </section> */}
    </div>
  );
}
