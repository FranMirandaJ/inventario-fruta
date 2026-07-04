"use client";

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
import { Badge } from "@/components/ui/badge";

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
            <div className="space-y-1.5 text-left max-w-[70%]">
              <h4 className="text-base font-semibold leading-none">
                {venta.detalles.length} productos
              </h4>

              <p className="text-sm text-muted-foreground leading-none">
                {venta.detalles.reduce((sum, det) => (sum += det.cantidad) , 0)} artículos en total por {capitalizeWords(venta.vendedor)}.
              </p>

              <p className="text-sm text-muted-foreground leading-none">
                <i>{formatRelativeDate(venta.fecha)}</i>
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
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-muted-foreground text-xs">{formatCurrency(art.precio_unitario)} c/u </span>
                  <Badge variant="outline" className="border-sky-300 text-sky-600 dark:border-sky-600 dark:text-sky-400 text-xs tabular-nums">
                    x{art.cantidad}
                  </Badge> =
                  <span className="text-foreground font-semibold tabular-nums">{formatCurrency(art.subtotal)}</span>
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ) : (
    <div className="rounded-lg border bg-card transition-colors duration-200 hover:bg-muted/30">
      <div className="flex items-start justify-between px-4 py-2.5">
        <div className="space-y-1.5 text-left max-w-[70%]">
          <h4 className="text-base font-semibold leading-none">{capitalizeFirstLetter(venta.detalles[0].producto_nombre)}</h4>

          <div className="text-sm text-muted-foreground leading-none">
            {capitalizeWords(venta.detalles[0].categoria)} · <span className="font-semibold">{formatCurrency(venta.detalles[0].precio_unitario)} c/u</span> <Badge variant="outline" className="border-sky-300 text-sky-600 dark:border-sky-600 dark:text-sky-400 text-xs tabular-nums">x{venta.detalles[0].cantidad}</Badge> por {capitalizeWords(venta.vendedor)}.
          </div>

          <p className="text-sm text-muted-foreground leading-none">
            <i>{formatRelativeDate(venta.fecha)}</i>
          </p>
        </div>

        <div className="flex items-center shrink-0 pr-6 mr-1 mt-0.5"> 
          <span className="text-base font-bold text-green-600 dark:text-green-400">{formatCurrency(venta.total)}</span>
        </div>
      </div>
    </div>
  );
}

export default function TablaVentas({
  ventas,
}: {
  ventas: VentaRow[];
}) {

  return (
    <div className="w-full">
      {/* ======= SECTION DE CARD LIST (MOBILE) ======= */}
      <section className="sm:hidden mt-8 space-y-3">
        {ventas.map(v => (
          <CardVenta key={v.id} venta={v} />
        ))}
      </section>

      {/* ======= SECTION DE TABLA (DESKTOP) ======= */}
      {/* <section>

      </section> */}

    </div>
  );
}
