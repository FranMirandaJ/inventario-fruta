"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import type { ProductoRow } from "@/lib/dal/productos";

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

  return (
    <Modal
      title={activating ? "Activar producto" : "Desactivar producto"}
      description={
        activating
          ? <>¿Estás seguro de activar &ldquo;{product.nombre}&rdquo;?<br />Este producto volverá a estar disponible para la venta.</>
          : <>¿Estás seguro de desactivar &ldquo;{product.nombre}&rdquo;?<br />Este producto dejará de estar disponible para la venta.</>
      }
      showTriggerButton={false}
      open={open}
      onOpenChange={onOpenChange}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant={activating ? "default" : "destructive"} onClick={() => onOpenChange(false)}>
            {activating ? "Activar" : "Desactivar"}
          </Button>
        </>
      }
    />
  );
}
