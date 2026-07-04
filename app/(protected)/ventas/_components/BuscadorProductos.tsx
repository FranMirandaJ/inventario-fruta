"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { ProductoParaVenta } from "@/lib/dal/productos";
import type { ItemCarrito } from "../_types";
import { capitalizeFirstLetter } from "@/lib/text";
import { formatCurrency } from "@/lib/money";

type Props = {
  productos: ProductoParaVenta[];
  itemsCarrito: ItemCarrito[];
  onProductoSelect: (producto: ProductoParaVenta) => void;
};

export default function BuscadorProductos({ productos, itemsCarrito, onProductoSelect }: Props) {

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  const filteredProducts = productos.filter((p) => {
    const enCarrito = itemsCarrito.find((item) => item.producto.id === p.id);
    return !(enCarrito && enCarrito.cantidad >= p.stock_actual);
  });

  const getStockDisponible = (idProducto: number, stockActual: number) => {
    const item = itemsCarrito.find(item => item.producto.id === idProducto);
    const cantidadCarrito = item ? item.cantidad : 0;
    return stockActual - cantidadCarrito;
  }

  const showList = (isFocused && inputValue.length > 0) || inputValue.length > 0;

  const handleItemSelect = (producto: ProductoParaVenta) => {
    onProductoSelect(producto);
    setInputValue("");
  };

  return (
    <Command 
      className="w-full sm:max-w-md rounded-lg border"
    >
      <CommandInput
        className="h-12 sm:h-9"
        placeholder="Buscar producto..."
        value={inputValue}
        onValueChange={setInputValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
      />

      {showList && (
        <CommandList className="max-h-50 sm:max-h-60 overflow-y-auto">

          <CommandEmpty>Sin resultados.</CommandEmpty>

          <CommandGroup>
            {filteredProducts.map((p) => (
              <CommandItem
                className="flex-row items-center gap-2 py-3 sm:py-1.5 data-[selected=true]:bg-amber-100 data-[selected=true]:text-black dark:data-[selected=true]:bg-lime-800/50 dark:data-[selected=true]:text-gray-200 active:scale-[0.98] active:bg-amber-50 transition-transform"
                key={p.id}
                value={p.nombre}
                keywords={[p.categoria_nombre]}
                onSelect={() => handleItemSelect(p) }
              >
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <strong>{capitalizeFirstLetter(p.nombre)}</strong>

                  <div className="flex flex-wrap items-center gap-x-2 text-center">
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded-md truncate">{capitalizeFirstLetter(p.categoria_nombre)}</span>
                    <span className="flex items-center gap-1">
                      <span className={`size-2 rounded-full ${getStockDisponible(p.id, p.stock_actual) <= p.stock_minimo ? 'bg-amber-500' : 'bg-green-500'}`} />
                      {getStockDisponible(p.id, p.stock_actual)} Disp.
                    </span>
                  </div>

                  <div className="text-green-500 sm:hidden">
                    <strong className="text-base font-bold">{formatCurrency(p.precio)}</strong>
                  </div>
                </div>

                <div className="text-green-500 hidden sm:flex items-center gap-1">
                  <strong>{formatCurrency(p.precio)}</strong>
                  <Plus className="size-5" />
                </div>

                <div className="sm:hidden">
                  <Plus className="size-5" />
                </div>

              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  );
}
