"use client";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import BuscadorProductos from "./BuscadorProductos";
import type { ProductoParaVenta } from "@/lib/dal/productos";
import type { ItemCarrito, ConfirmarVentaItem } from "../_types";
import { useState } from "react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/money";
import { capitalizeFirstLetter } from "@/lib/text";

type Props = {
  productos: ProductoParaVenta[];
};

export default function ModalRegistrarVenta({ productos }: Props) {

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [itemsCarrito, setItemsCarrito] = useState<ItemCarrito[]>([]);

  const handleAgregarAlCarrito = (producto: ProductoParaVenta) => {
    const yaSinStock = itemsCarrito.some(
      (item) => item.producto.id === producto.id && item.cantidad >= producto.stock_actual,
    );

    if (yaSinStock) {
      toast.warning(`Ya no hay stock suficiente de "${producto.nombre}".`);
      return;
    }

    setItemsCarrito((prev) => {
      const existente = prev.find((i) => i.producto.id === producto.id);
      if (existente) {
        return prev.map((i) =>
          i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i,
        );
      }
      return [{ producto, cantidad: 1 }, ...prev];
    });
  };

  const handleActualizarCantidad = (id: number, delta: number) => {
    setItemsCarrito((prev) =>
      prev.map((i) =>
        i.producto.id === id
          ? {
              ...i,
              cantidad: Math.min(
                i.producto.stock_actual,
                Math.max(1, i.cantidad + delta),
              ),
            }
          : i,
      ),
    );
  };

  const handleRemoverDelCarrito = (id: number) => {
    setItemsCarrito((prev) => prev.filter((i) => i.producto.id !== id));
  };

  const handleConfirmarVenta = () => {
    if (itemsCarrito.length === 0) return toast.warning("El carrito esta vacío.");
    const payload: ConfirmarVentaItem[] = itemsCarrito.map(item => (
      {
        id_producto: item.producto.id,
        cantidad: item.cantidad,
      }
    ));
    console.log(payload);
  };

  //console.log(itemsCarrito);

  return (
    <Modal
      title="Registrar venta"
      description={<>Agrega productos al carrito y confirma la venta.</>}
      headerImgSrc="/shopping-cart.svg"
      textTriggerButton="Vender"
      triggerButtonVariant="default"
      iconTriggerButton={<ShoppingCart className="size-4" />}
      fixedLayout={false}
      open={openModal}
      onOpenChange={(open) => {
        setOpenModal(open);
        if (!open) setItemsCarrito([]);
      }}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={() => setOpenModal(false)}
          >
            Cancelar
          </Button>
          <Button onClick={() => handleConfirmarVenta()}>Confirmar venta</Button>
        </>
      }
    >
      <div className="space-y-4">
        <BuscadorProductos
          productos={productos}
          onProductoSelect={handleAgregarAlCarrito}
        />

        <div className="flex flex-col text-sm space-y-2">
          <div className="flex flex-wrap items-center justify-between">
            <span className="font-semibold">Carrito ({itemsCarrito.reduce((sum, item) => (sum += item.cantidad), 0)})</span>
            {itemsCarrito.length > 0 && (
              <Button 
                variant="ghost"
                size="sm"
                className="text-sm"
                onClick={() => setItemsCarrito([])}
              >
                <Trash2 /> Vaciar
              </Button>
            )}
          </div>

          {itemsCarrito.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-5 rounded-lg border-2 text-muted-foreground">
              <ShoppingCart className="size-8 opacity-50"/>
              <span className="font-medium text-center">Busca y agrega productos.</span>
            </div>
          )}

          {itemsCarrito.length > 0 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                {itemsCarrito.map((item) => (
                <div
                  key={item.producto.id}
                  className="flex flex-col gap-2 p-2.5 rounded-lg border bg-white dark:bg-zinc-800"
                >
                  <div className="flex flex-wrap items-center justify-between">
                    <strong>
                      {capitalizeFirstLetter(item.producto.nombre)}
                    </strong>
                    <span className="font-semibold text-sm whitespace-nowrap ml-2">
                      {formatCurrency(item.producto.precio * item.cantidad)}
                    </span>
                  </div>

                  
                    <span className="text-sm">
                      {formatCurrency(item.producto.precio)} / unidad
                    </span>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1 border-2 border-orange-300 rounded-xl">
                      <Button
                        type="button"
                        onClick={() => handleActualizarCantidad(item.producto.id, -1)}
                        disabled={item.cantidad <= 1}
                        variant="ghost"
                        size="icon-sm"
                      >
                        <Minus />
                      </Button>
                      <span className="min-w-8 text-center font-bold">
                        {item.cantidad}
                      </span>
                      <Button
                        type="button"
                        onClick={() => handleActualizarCantidad(item.producto.id, 1)}
                        disabled={item.cantidad >= item.producto.stock_actual}
                        variant="ghost"
                        size="icon-sm"
                      >
                        <Plus />
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handleRemoverDelCarrito(item.producto.id) }
                    >
                      Eliminar
                    </Button>

                  </div>
                </div>
              ))}
              </div>

              <Separator className="shadow-xl"/>
              
              <div className="flex gap-3 flex-wrap items-center justify-between p-2.5 rounded-md bg-green-100 dark:bg-green-950/60">
                <label className="font-bold dark:text-green-100">Total de la venta</label>
                <strong className="text-green-600 dark:text-greem-400">{formatCurrency(itemsCarrito.reduce((sum, item) => (sum += item.cantidad * item.producto.precio), 0))}</strong>
              </div>

            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
