"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
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
    <Modal
      title={activating ? "Activar producto" : "Desactivar producto"}
      description={
        activating
          ? <>¿Estás seguro de activar el producto <strong>"{capitalizeFirstLetter(product.nombre)}"</strong>?<br />Este producto volverá a estar disponible para la venta.</>
          : <>¿Estás seguro de desactivar el producto <strong>"{capitalizeFirstLetter(product.nombre)}"</strong>?<br />Este producto dejará de estar disponible para la venta.</>
      }
      showTriggerButton={false}
      open={open}
      onOpenChange={onOpenChange}
      footer={
        <form action={action}>
          <input type="hidden" name="id" value={product.id} />
          <div className="flex gap-2">
            <Button disabled={pending} type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant={activating ? "default" : "destructive"}>
              {pending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {activating ? "Activando..." : "Desactivando..."}
                  </>
                ) : (
                  activating ? "Activar" : "Desactivar"
                )}
            </Button>
          </div>
        </form>
      }
    />
  );
}
