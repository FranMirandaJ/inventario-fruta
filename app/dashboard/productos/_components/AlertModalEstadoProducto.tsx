"use client";

import { useActionState, useEffect } from "react";
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
import type { ProductoRow } from "@/lib/dal/productos";
import { capitalizeFirstLetter } from "@/lib/text";
import { cambiarEstadoProducto } from "../_actions/actualizar-estado-producto";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Props = {
  product: ProductoRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AlertModalEstadoProducto({
    product,
    open,
    onOpenChange,
}: Props) {
    
  if (!product) return null;

  const activating = !product.activo;

  const [state, action, pending] = useActionState(cambiarEstadoProducto, undefined);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      onOpenChange(false);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {activating ? "Activar producto" : "Desactivar producto"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {activating
              ? <>¿Estás seguro de activar el producto <strong>"{capitalizeFirstLetter(product.nombre)}"</strong>?<br />Este producto volverá a estar disponible para la venta.</>
              : <>¿Estás seguro de desactivar el producto <strong>"{capitalizeFirstLetter(product.nombre)}"</strong>?<br />Este producto dejará de estar disponible para la venta.</>
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form action={action}>
          <input type="hidden" name="id" value={product.id} />
          <AlertDialogFooter>
            <AlertDialogCancel type="button" disabled={pending}>
              Cancelar
            </AlertDialogCancel>
            <Button type="submit" disabled={pending} variant={activating ? "default" : "destructive"}>
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {activating ? "Activando..." : "Desactivando..."}
                </>
              ) : (
                activating ? "Activar" : "Desactivar"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
