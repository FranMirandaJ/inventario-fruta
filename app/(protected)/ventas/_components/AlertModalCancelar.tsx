"use client";

import { useTransition } from "react";
import { toast } from "sonner";
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
import { cancelarVenta } from "../_actions/cancelar-venta.action";
import { Loader2 } from "lucide-react";

type Props = {
  venta: VentaRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AlertModalCancelar({
  venta,
  open,
  onOpenChange,
} : Props) {

  const [pending, startTransition] = useTransition();

  const handleConfirm = () => {
    if (!venta) return;

    startTransition(async () => {
      const result = await cancelarVenta(venta.id);

      if (result?.success) {
        toast.success(result.message);
        onOpenChange(false);
      } else {
        toast.error(result?.message || "Ocurrió un error al cancelar la venta.");
      }
    });
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
          <AlertDialogCancel type="button" disabled={pending}>No, mantener</AlertDialogCancel>
          <Button variant="destructive" disabled={pending} onClick={handleConfirm}>
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Cancelando...
              </>
            ) : (
              "Cancelar venta"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
