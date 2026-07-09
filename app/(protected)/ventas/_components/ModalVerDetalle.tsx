"use client";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table";
import type { VentaRow } from "@/lib/dal/ventas";
import { formatCurrency } from "@/lib/money";
import { formatRelativeDate } from "@/lib/date";
import { capitalizeWords, capitalizeFirstLetter } from "@/lib/text";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venta: VentaRow;
};

export default function ModalVerDetalle({
  open,
  onOpenChange,
  venta,
} : Props) {
  return (
    <Modal
      title={`Detalle de la venta N.º ${venta.id}`}
      showTriggerButton={false}
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cerrar
        </Button>
      }
      description={<span className="sr-only">Registrada por {capitalizeWords(venta.vendedor)}</span>}
    >
      <div className="space-y-4">

        {/* Vendedor + Fecha */}
        <div className="flex gap-5 items-center justify-between text-sm text-muted-foreground">
          <span className="text-left">{capitalizeWords(venta.vendedor)}</span>
          <span className="text-right">{formatRelativeDate(venta.fecha)}</span>
        </div>

        <Separator />

        {/* Tabla de productos */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-center">Cant</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {venta.detalles.map(det => (
              <TableRow key={det.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{capitalizeFirstLetter(det.producto_nombre)}</span>
                    <span className="text-xs text-muted-foreground">{det.categoria}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">{formatCurrency(det.precio_unitario)}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className="border-sky-300 text-sky-600 dark:border-sky-600 dark:text-sky-400 tabular-nums"
                  >
                    x{det.cantidad}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium">{formatCurrency(det.subtotal)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
                <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right font-bold text-green-600 dark:text-green-400">{formatCurrency(venta.total)}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>

      </div>
    </Modal>
  );
}
