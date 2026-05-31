"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import { Loader2 } from "lucide-react";
import type { CategoriaOption } from "@/lib/dal/categorias";
import { useActionState } from "react";
import { actualizarProducto } from "../_actions/actualizar-producto.action";
import FormProducto from "./FormProducto";
import type { ProductoRow } from "@/lib/dal/productos";

type Props = {
  product: ProductoRow | null;
  categorias: CategoriaOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ModalEditarProducto({
  product,
  categorias,
  open,
  onOpenChange,
}: Props) {
  const [state, action, pending] = useActionState(actualizarProducto, undefined);

  return (
    <Modal
      title="Editar producto"
      description={<>Actualiza los datos del producto.<br/>Los campos con <span className="text-destructive">*</span> son obligatorios.</>}
      fixedLayout={false}
      showTriggerButton={false}
      open={open}
      onOpenChange={onOpenChange}
      footer={
        <Button type="submit" form="editar-producto" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Actualizando...
            </>
          ) : (
            "Actualizar"
          )}
        </Button>
      }
      headerImgSrc="/icecream.svg"
    >
      {product && (
        <FormProducto
          key={product.id}
          mode="edit"
          productoId={product.id}
          initialData={{
            nombre: product.nombre,
            categoria: String(product.categoria_id),
            precio: String(product.precio),
            stock_actual: String(product.stock_actual),
            stock_minimo: String(product.stock_minimo),
          }}
          categorias={categorias}
          state={state}
          action={action}
          pending={pending}
          onSuccess={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
