"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Paginacion from "@/components/Paginacion";
import type { VentaRow } from "@/lib/dal/ventas";
import { formatCurrency } from "@/lib/money";
import { formatRelativeDate } from "@/lib/date";
import { capitalizeFirstLetter, capitalizeWords } from "@/lib/text";
import { MoreHorizontalIcon, SearchXIcon, PackageOpen } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";

const ModalVerDetalle = dynamic(() => import("./ModalVerDetalle"));
const AlertModalCancelar = dynamic(() => import("./AlertModalCancelar"));

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
                Venta N.º {venta.id}
              </h4>

              <p className="text-sm text-muted-foreground leading-none">
                {venta.detalles.reduce((sum, det) => (sum += det.cantidad) , 0)} artículos en total por {capitalizeWords(venta.vendedor)}.
              </p>

              <br/>

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
                  <span className="text-foreground font-medium tabular-nums">{formatCurrency(art.subtotal)}</span>
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
          <h4 className="text-base font-semibold leading-none">Venta N.º {venta.id}</h4>

          <div className="text-sm text-muted-foreground leading-none">
            <Badge variant="outline" className="border-sky-300 text-sky-600 dark:border-sky-600 dark:text-sky-400 text-xs tabular-nums">
              x{venta.detalles[0].cantidad}
            </Badge>&nbsp;
            {capitalizeWords(venta.detalles[0].producto_nombre)}&nbsp;·&nbsp;
            <span className="font-semibold">{formatCurrency(venta.detalles[0].precio_unitario)} c/u </span> 
            &nbsp;por {capitalizeWords(venta.vendedor)}.
          </div>

          <br/>

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

function FilaVenta({ venta } : { venta: VentaRow }) {

  const [abrirModalDetalles, setAbrirModalDetalles] = useState<boolean>(false);
  const [abrirConfirmarCancelar, setAbrirConfirmarCancelar] = useState<boolean>(false);

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{venta.id}</TableCell>
        <TableCell>{formatRelativeDate(venta.fecha)}</TableCell>
        <TableCell>{capitalizeWords(venta.vendedor)}</TableCell>
        <TableCell>{venta.detalles.length > 1 ? venta.detalles.reduce((sum, det) => (sum += det.cantidad) , 0) : venta.detalles[0].cantidad}</TableCell>
        <TableCell>{formatCurrency(venta.total)}</TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontalIcon />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setAbrirModalDetalles(true)}>Ver detalle</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setAbrirConfirmarCancelar(true)} variant="destructive">
                Cancelar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <ModalVerDetalle
        open={abrirModalDetalles}
        onOpenChange={setAbrirModalDetalles}
        venta={venta}
      />

      <AlertModalCancelar
        open={abrirConfirmarCancelar}
        onOpenChange={setAbrirConfirmarCancelar}
        venta={venta}
      />

    </>
  );
}

export default function TablaVentas({
  ventas,
  totalPages,
}: {
  ventas: VentaRow[];
  totalPages: number;
}) {

  const searchParams = useSearchParams();
  const tieneFiltros = Boolean(searchParams.get("q") || searchParams.get("desde") || searchParams.get("hasta"));

  if (ventas.length === 0) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-4 px-4">
          {tieneFiltros ? (
            <>
              <SearchXIcon className="size-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Sin resultados</h3>
              <p className="text-sm text-muted-foreground mt-1 text-center max-w-xs">
                No se encontraron ventas con los filtros actuales.
              </p>
            </>
          ) : (
            <>
              <PackageOpen className="size-16 mb-4 text-muted-foreground"/>
              <h3 className="text-lg font-semibold text-foreground">Aún no hay ventas</h3>
              <p className="text-sm text-muted-foreground mt-1 text-center max-w-xs">
                Las ventas registradas aparecerán aquí.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ======= SECTION DE CARD LIST (MOBILE) ======= */}
      <section className="sm:hidden mt-8 space-y-3">
        {ventas.map(v => (
          <CardVenta key={v.id} venta={v} />
        ))}
      </section>

      {/* ======= SECTION DE TABLA (DESKTOP) ======= */}
      <section className="hidden sm:block">
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
            {ventas.map(v => (
              <FilaVenta key={v.id} venta={v}/>
            ))}
          </TableBody>

        </Table>
      </section>

      {/* ======= PAGINACION  ======= */}
      <Paginacion totalPages={totalPages} />

    </div>
  );
}
