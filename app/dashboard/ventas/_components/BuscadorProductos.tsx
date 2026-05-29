"use client";

import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import type { ProductoParaVenta } from "@/lib/dal/productos";
import { capitalizeFirstLetter } from "@/lib/text";
import { formatCurrency } from "@/lib/money";

type Props = {
  productos: ProductoParaVenta[];
};

export default function BuscadorProductos({ productos }: Props) {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  const showList = (isFocused && inputValue.length > 0) || inputValue.length > 0;

  return (
    <Command className="w-full sm:max-w-md rounded-lg border">
      <CommandInput
        className="h-12 sm:h-9"
        placeholder="Buscar producto..."
        value={inputValue}
        onValueChange={setInputValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
      />

      {showList && (
        <CommandList>
          <CommandEmpty>No encontrado.</CommandEmpty>

          <CommandGroup>
            {productos.map((producto) => (
              <CommandItem key={producto.id} className="flex-col items-start gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-1.5 data-[selected=true]:bg-amber-100 data-[selected=true]:text-black dark:data-[selected=true]:bg-amber-700 dark:data-[selected=true]:text-gray-200">
                <div className="flex flex-col gap-1">
                  <strong>{capitalizeFirstLetter(producto.nombre)}</strong>
                  <div className="flex gap-2 text-center">
                    <span>{capitalizeFirstLetter(producto.categoria_nombre)}</span> <strong>&middot;</strong>
                    <span>Stock: {producto.stock_actual}</span>
                  </div>
                </div>

                <div className="text-green-500 dark:text-lime-400">
                  <strong>{formatCurrency(producto.precio)}</strong>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  );
}
