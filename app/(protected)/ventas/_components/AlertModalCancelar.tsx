"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { VentaRow } from "@/lib/dal/ventas";
import { formatCurrency } from "@/lib/money";
import { capitalizeWords } from "@/lib/text";

type Props = {
  venta: VentaRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => Promise<void> | void;
};

export default function AlertModalCancelar({
  venta,
  open,
  onOpenChange,
  onConfirm,
} : Props) {

  const handleConfirm = async () => {
    await onConfirm?.();
    onOpenChange(false);
  };

  if (!venta) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar venta</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de cancelar la venta{" "}
            <strong>N.º {venta.id}</strong> con un total de{" "}
            <strong>{formatCurrency(venta.total)}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm space-y-3">
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-muted-foreground text-xs sm:text-sm">Vendedor</span>
                <span className="font-medium">{capitalizeWords(venta.vendedor)}</span>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-muted-foreground text-xs sm:text-sm">Artículos</span>
                <span className="font-medium">{venta.detalles.reduce((sum, d) => sum + d.cantidad, 0)}</span>
            </div>
        </div>

        <AlertDialogDescription className="text-xs text-muted-foreground">
          Esta acción no se puede deshacer. El stock de los productos será restituido automáticamente.
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel type="button">No, mantener</AlertDialogCancel>
          <Button variant="destructive" onClick={handleConfirm}>
            Cancelar venta
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
