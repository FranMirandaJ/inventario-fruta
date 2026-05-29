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

export default function BuscadorProductos() {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  const showList = isFocused || inputValue.length > 0;

  return (
    <Command className="max-w-md rounded-lg border">
      <CommandInput
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

            <CommandItem  className="justify-between data-[selected=true]:bg-amber-100 data-[selected=true]:text-black dark:data-[selected=true]:bg-amber-700 dark:data-[selected=true]:text-gray-200">
              <div className="flex flex-col gap-1">
                <strong>Pulpa de mango</strong>
                <div className="flex gap-2 text-center">
                    <span>Pulpa de frutas</span> <strong>&middot;</strong>
                    <span>Stock: 30</span>
                </div>
              </div>

              <div className="text-green-500 dark:text-lime-400">
                <strong>$15</strong>
              </div>
            </CommandItem>

          </CommandGroup>

        </CommandList>
      )}
    </Command>
  );
}
