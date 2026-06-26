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
import type { VentaRow } from "@/lib/dal/ventas";
import { formatCurrency } from "@/lib/money";
import { formatRelativeDate } from "@/lib/date";
import { capitalizeFirstLetter, capitalizeWords } from "@/lib/text";

function CardVenta({ venta }: { venta: VentaRow }) {
  return venta.detalles.length > 1 ? (
    <Accordion
      type="single"
      collapsible
      className=" rounded-lg border bg-card"
    >
      <AccordionItem
        value={String(venta.id)}
        className="rounded-lg border-none transition-colors duration-200 hover:bg-muted/30"
      >
        <AccordionTrigger className="items-start px-4 py-2.5 hover:no-underline">
          <div className="flex w-full items-start justify-between">
            <div className="space-y-1.5 text-left max-w-[75%]">
              <h4 className="text-base font-semibold leading-none">
                {venta.detalles.length} productos
              </h4>

              <p className="text-sm text-muted-foreground leading-none">
                {venta.detalles.reduce((sum, det) => (sum += det.cantidad) , 0)} artículos por <i>{capitalizeWords(venta.vendedor)}</i>.
              </p>

              <p className="text-sm text-muted-foreground leading-none">
                {formatRelativeDate(venta.fecha)}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-base font-bold text-green-600 dark:text-green-400">{formatCurrency(venta.total)}</span>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="border-t px-4 py-3">
          <div className="space-y-2">
            {venta.detalles.map(art => (
              <div key={art.id} className="flex justify-between text-sm">
                <span>{capitalizeFirstLetter(art.producto_nombre)}</span>
                <span className="text-muted-foreground">x{art.cantidad} = {formatCurrency(art.subtotal)}</span>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ) : (
    <div className="rounded-lg border bg-card transition-colors duration-200 hover:bg-muted/30">
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="space-y-1.5 text-left max-w-[75%]">
          <h4 className="text-base font-semibold leading-none">{capitalizeFirstLetter(venta.detalles[0].producto_nombre)}</h4>

          <div className="text-sm text-muted-foreground leading-none">
            {capitalizeWords(venta.detalles[0].categoria)} <strong>x{venta.detalles[0].cantidad}</strong> por <i>{capitalizeWords(venta.vendedor)}</i>.
          </div>

          <p className="text-sm text-muted-foreground leading-none">
            {formatRelativeDate(venta.fecha)}
          </p>
        </div>

        <span className="text-base font-bold text-green-600 dark:text-green-400 shrink-0">{formatCurrency(venta.total)}</span>
      </div>
    </div>
  );
}

export default function TablaVentas({ ventas }: { ventas: VentaRow[] }) {
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
      <section className="sm:hidden mt-8 space-y-3">
        {ventas.map(v => (
          <CardVenta key={v.id} venta={v} />
        ))}
        {/* <CardVenta venta={ventas[1]} /> */}
      </section>

      {/* ======= SECTION DE TABLA (DESKTOP) ======= */}
      {/* <section>

      </section> */}
    </div>
  );
}
