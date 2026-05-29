"use client";

import Modal from "@/components/Modal";
import { ShoppingCart } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import BuscadorProductos from "./BuscadorProductos";

export default function ModalRegistrarVenta() {
  return (
    <Modal
      title="Registrar venta"
      description={<>Agrega productos al carrito y confirma la venta.</>}
      textTriggerButton="Vender"
      triggerButtonVariant="default"
      iconTriggerButton={<ShoppingCart className="size-4" />}
    >
      <BuscadorProductos/>
    </Modal>
  );
}
