"use client";

import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import type { CategoriaOption } from "@/lib/dal/categorias";
import { useEffect, useRef, useState } from "react";
import { ProductoFormSchema, type ProductoFormState } from "../_schemas/crear-producto.schema";
import { toast } from "sonner";

export type ProductoRawInputs = {
  nombre: string;
  categoria: string;
  precio: string;
  stock_actual: string;
  stock_minimo: string;
};

type PropsFormProducto = {
  mode: "create" | "edit";
  productoId?: number;
  initialData?: ProductoRawInputs;
  categorias: CategoriaOption[];
  state: ProductoFormState;
  action: (payload: FormData) => void;
  pending: boolean;
  onSuccess: () => void;
};

export default function FormProducto({
  mode,
  productoId,
  initialData,
  categorias,
  state,
  action,
  pending,
  onSuccess,
}: PropsFormProducto) {
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const processedTimestamp = useRef(state?.timestamp);
  const formId = mode === "create" ? "crear-producto" : "editar-producto";

  const defaultCategoria = initialData
    ? categorias.find((c) => String(c.id) === initialData.categoria)
    : undefined;

  useEffect(() => {
    if (!state || !hasSubmitted) return;
    if (processedTimestamp.current === state.timestamp) return;
    processedTimestamp.current = state.timestamp;

    if (state.success) {
      toast.success(state.message);
      onSuccess();
    } else {
      toast.error(state.message);
    }
  }, [state?.timestamp, onSuccess, hasSubmitted]);

  const getFieldErrors = (field: string) =>
    clientErrors[field] ?? state?.errors?.[field as keyof typeof state.errors] ?? undefined;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const data = {
      nombre: formData.get("nombre")?.toString() || "",
      categoria: formData.get("categoria")?.toString() || "",
      precio: formData.get("precio")?.toString() || "",
      stock_actual: formData.get("stock_actual")?.toString() || "",
      stock_minimo: formData.get("stock_minimo")?.toString() || "",
    };

    const result = ProductoFormSchema.safeParse(data);

    if (!result.success) {
      e.preventDefault();
      setClientErrors(result.error.flatten((issue) => issue.message).fieldErrors);
      toast.error("Faltan campos por llenar o hay errores.");
      return;
    }

    setClientErrors({});
    setHasSubmitted(true);
  };

  const defaultVal = (field: keyof ProductoRawInputs) =>
    state?.inputs?.[field] ?? initialData?.[field] ?? "";

  return (
    <form id={formId} action={action} onSubmit={handleSubmit}>
      {mode === "edit" && productoId != null && (
        <input type="hidden" name="producto_id" value={productoId} />
      )}
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="nombre">
            Nombre <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="nombre"
            type="text"
            name="nombre"
            placeholder="Nombre del producto"
            aria-invalid={!!getFieldErrors("nombre")}
            disabled={pending}
            defaultValue={defaultVal("nombre")}
          />
          {getFieldErrors("nombre") && (
            <FieldError>{getFieldErrors("nombre")![0]}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="categoria_combo">
            Categoría <span className="text-destructive">*</span>
          </FieldLabel>
          <Combobox
            name="categoria"
            items={categorias}
            itemToStringLabel={(c: CategoriaOption) => c.nombre}
            itemToStringValue={(c: CategoriaOption) => String(c.id)}
            defaultValue={defaultCategoria}
            autoHighlight={true}
          >
            <ComboboxInput
              id="categoria_combo"
              placeholder="Seleccione una categoría."
              showClear
              aria-invalid={!!getFieldErrors("categoria")}
              disabled={pending}
            />
            <ComboboxContent
              onWheel={(e) => e.stopPropagation()}
              className="pointer-events-auto"
            >
              <ComboboxEmpty>No se encontraron categorías.</ComboboxEmpty>
              <ComboboxList>
                {(categoria: CategoriaOption) => (
                  <ComboboxItem key={categoria.id} value={categoria}>
                    {categoria.nombre}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {getFieldErrors("categoria") && (
            <FieldError>{getFieldErrors("categoria")![0]}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="precio">
            Precio de venta <span className="text-destructive">*</span>
          </FieldLabel>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              $
            </span>
            <Input
              id="precio"
              name="precio"
              type="text"
              inputMode="decimal"
              className="pl-7"
              placeholder="0.00"
              aria-invalid={!!getFieldErrors("precio")}
              disabled={pending}
              defaultValue={defaultVal("precio")}
              onInput={(e) => {
                const input = e.currentTarget;
                const validValue =
                  input.value
                    .replace(/[^0-9.]/g, "")
                    .match(/^\d*\.?\d{0,2}/)?.[0] || "";
                if (input.value !== validValue) {
                  input.value = validValue;
                }
              }}
            />
          </div>
          {getFieldErrors("precio") && (
            <FieldError>{getFieldErrors("precio")![0]}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="stock_actual">Stock actual</FieldLabel>
          <FieldDescription>
            Cantidad física disponible en este momento.
          </FieldDescription>
          <Input
            id="stock_actual"
            name="stock_actual"
            type="text"
            inputMode="numeric"
            placeholder="0"
            aria-invalid={!!getFieldErrors("stock_actual")}
            disabled={pending}
            defaultValue={defaultVal("stock_actual")}
            onInput={(e) => {
              const input = e.currentTarget;
              const validValue = input.value.replace(/[^0-9]/g, "");
              if (input.value !== validValue) {
                input.value = validValue;
              }
            }}
          />
          {getFieldErrors("stock_actual") && (
            <FieldError>{getFieldErrors("stock_actual")![0]}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="stock_minimo">Stock mínimo</FieldLabel>
          <FieldDescription>
            Recibirás una alerta cuando la cantidad llegue a este nivel o sea
            menor.
          </FieldDescription>
          <Input
            id="stock_minimo"
            name="stock_minimo"
            type="text"
            inputMode="numeric"
            placeholder="1"
            aria-invalid={!!getFieldErrors("stock_minimo")}
            disabled={pending}
            defaultValue={defaultVal("stock_minimo")}
            onInput={(e) => {
              const input = e.currentTarget;
              const validValue = input.value.replace(/[^0-9]/g, "");
              if (input.value !== validValue) {
                input.value = validValue;
              }
            }}
          />
          {getFieldErrors("stock_minimo") && (
            <FieldError>{getFieldErrors("stock_minimo")![0]}</FieldError>
          )}
        </Field>
      </FieldGroup>
    </form>
  );
}
