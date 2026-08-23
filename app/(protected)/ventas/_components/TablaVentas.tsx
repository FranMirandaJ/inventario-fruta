"use client";

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
import { MoreHorizontalIcon, SearchXIcon, PackageOpen, ChevronDownIcon, BanIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import BotonPermiso from "@/components/BotonPermiso";
import DropdownMenuItemPermiso from "@/components/DropdownMenuItemPermiso";
import { PERMISOS } from "@/lib/permisos";

const ModalVerDetalle = dynamic(() => import("./ModalVerDetalle"));
const AlertModalCancelar = dynamic(() => import("./AlertModalCancelar"));

function CardVenta({ venta }: { venta: VentaRow }) {
  const [abierto, setAbierto] = useState(false);
  const [abrirConfirmarCancelar, setAbrirConfirmarCancelar] = useState(false);

  return venta.detalles.length > 1 ? (
    <div className="rounded-lg border bg-card transition-colors duration-200 hover:bg-muted/30">
      <div
        className="px-4 py-2.5 cursor-pointer select-none"
        onClick={() => setAbierto(!abierto)}
      >
        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold leading-none">Venta N.º {venta.id}</h4>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-base font-bold text-green-600 dark:text-green-400">{formatCurrency(venta.total)}</span>
            <ChevronDownIcon
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                abierto && "rotate-180"
              )}
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-none mt-1.5">
          {venta.detalles.reduce((sum, det) => (sum += det.cantidad) , 0)} artículos en total por {capitalizeWords(venta.vendedor)}.
        </p>

        <br/>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground leading-none">
            <i>{formatRelativeDate(venta.fecha)}</i>
          </p>
          <BotonPermiso
            type="button"
            permiso={PERMISOS.ventasCancelar}
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/10 dark:hover:text-destructive"
            onClick={(e) => { e.stopPropagation(); setAbrirConfirmarCancelar(true); }}
          >
            <BanIcon />
            <span className="sr-only">Cancelar venta</span>
          </BotonPermiso>
        </div>
      </div>

      <div
        className="overflow-hidden text-sm"
        style={{
          display: "grid",
          gridTemplateRows: abierto ? "1fr" : "0fr",
          transition: "grid-template-rows 200ms ease-out",
        }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t px-4 py-3">
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
          </div>
        </div>
      </div>

      <AlertModalCancelar
        open={abrirConfirmarCancelar}
        onOpenChange={setAbrirConfirmarCancelar}
        venta={venta}
      />
    </div>
  ) : (
    <div className="rounded-lg border bg-card transition-colors duration-200 hover:bg-muted/30">
      <div className="px-4 py-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold leading-none">Venta N.º {venta.id}</h4>
          <span className="text-base font-bold text-green-600 dark:text-green-400">{formatCurrency(venta.total)}</span>
        </div>

        <div className="text-sm text-muted-foreground leading-tight mt-1.5">
          <Badge variant="outline" className="border-sky-300 text-sky-600 dark:border-sky-600 dark:text-sky-400 text-xs tabular-nums">
            x{venta.detalles[0].cantidad}
          </Badge>&nbsp;
          {capitalizeWords(venta.detalles[0].producto_nombre)}&nbsp;·&nbsp;
          <span className="font-semibold">{formatCurrency(venta.detalles[0].precio_unitario)} c/u </span> 
          &nbsp;por {capitalizeWords(venta.vendedor)}.
        </div>

        <div className="flex items-center justify-between mt-1.5">
          <p className="text-sm text-muted-foreground leading-none">
            <i>{formatRelativeDate(venta.fecha)}</i>
          </p>
          <BotonPermiso
            type="button"
            permiso={PERMISOS.ventasCancelar}
            variant="outline"
            size="icon-sm"
            color="red"
            onClick={() => setAbrirConfirmarCancelar(true)}
          >
            <BanIcon />
            <span className="sr-only">Cancelar venta</span>
          </BotonPermiso>
        </div>
      </div>

      <AlertModalCancelar
        open={abrirConfirmarCancelar}
        onOpenChange={setAbrirConfirmarCancelar}
        venta={venta}
      />
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
              <DropdownMenuItemPermiso
                permiso={PERMISOS.ventasCancelar}
                onClick={() => setAbrirConfirmarCancelar(true)}
                variant="destructive"
              >
                Cancelar
              </DropdownMenuItemPermiso>
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
