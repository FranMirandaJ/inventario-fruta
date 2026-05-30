"use client";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import BuscadorProductos from "./BuscadorProductos";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProductoParaVenta } from "@/lib/dal/productos";
import type { ItemCarrito } from "../_types";
import { useState } from "react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/money";
import { capitalizeFirstLetter } from "@/lib/text";

type Props = {
  productos: ProductoParaVenta[];
};

export default function ModalRegistrarVenta({ productos }: Props) {
  const [itemsCarrito, setItemsCarrito] = useState<ItemCarrito[]>([]);

  const handleAgregarAlCarrito = (producto: ProductoParaVenta) => {
    setItemsCarrito((prev) => {
      const existente = prev.find((i) => i.producto.id === producto.id);
      if (existente) {
        if (existente.cantidad >= producto.stock_actual) {
          toast.warning(`Ya no hay stock suficiente de "${producto.nombre}"`);
          return prev;
        }
        return prev.map((i) =>
          i.producto.id === producto.id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i,
        );
      }
      return [...prev, { producto, cantidad: 1 }];
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

  console.log(itemsCarrito);

  return (
    <Modal
      title="Registrar venta"
      description={<>Agrega productos al carrito y confirma la venta.</>}
      textTriggerButton="Vender"
      triggerButtonVariant="default"
      iconTriggerButton={<ShoppingCart className="size-4" />}
      onOpenChange={(open) => {
        if (!open) setItemsCarrito([]);
      }}
    >
      <div className="space-y-4">
        <BuscadorProductos
          productos={productos}
          onProductoSelect={handleAgregarAlCarrito}
        />

        <div className="flex flex-col text-sm space-y-2">
          <div className="flex items-center justify-between">
            <span>Carrito ({itemsCarrito.reduce((sum, item) => (sum += item.cantidad), 0)})</span>
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
          {itemsCarrito.length > 0 && (
            <>
              <div className="space-y-1.5">
                {itemsCarrito.map((item) => (
                <div
                  key={item.producto.id}
                  className="flex flex-col gap-2 p-2.5 rounded-lg border"
                >
                  <div className="flex flex-wrap items-center justify-between">
                    <strong>
                      {capitalizeFirstLetter(item.producto.nombre)}
                    </strong>
                    <span className="text-green-600 font-semibold text-sm tabular-nums whitespace-nowrap ml-2">
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
                      <span className="">
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

              <Separator />
              
              <div className="">
                <span>Total de la venta:</span>
                <span>{formatCurrency(itemsCarrito.reduce((sum, item) => (sum += item.cantidad * item.producto.precio), 0))}</span>
              </div>

            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
