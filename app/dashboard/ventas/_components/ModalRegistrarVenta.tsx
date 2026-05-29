"use client";

import Modal from "@/components/Modal";
import { ShoppingCart } from "lucide-react";
import BuscadorProductos from "./BuscadorProductos";
import type { ProductoParaVenta } from "@/lib/dal/productos";
import type { ItemCarrito } from "../_types";

type Props = {
  productos: ProductoParaVenta[];
};

export default function ModalRegistrarVenta({ productos }: Props) {

  

  return (
    <Modal
      title="Registrar venta"
      description={<>Agrega productos al carrito y confirma la venta.</>}
      textTriggerButton="Vender"
      triggerButtonVariant="default"
      iconTriggerButton={<ShoppingCart className="size-4" />}
    >
      <BuscadorProductos productos={productos} />
    </Modal>
  );
}
