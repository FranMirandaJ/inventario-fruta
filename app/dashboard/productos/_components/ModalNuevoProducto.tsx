"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/Modal";
import { Plus, Loader2 } from "lucide-react";
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
import { CategoriaOption } from "@/lib/dal/categorias";
import { useActionState, useCallback, useEffect, useState } from "react";
import { crearProducto } from "../_actions/crear-producto.action";
import { toast } from "sonner";

type PropsModalNuevoProducto = {
  categorias: CategoriaOption[];
};

function FormContent({
  categorias,
  onSuccess,
  onPendingChange,
}: {
  categorias: CategoriaOption[];
  onSuccess: () => void;
  onPendingChange?: (pending: boolean) => void;
}) {
  const [state, action, pending] = useActionState(crearProducto, undefined);

  useEffect(() => {
    onPendingChange?.(pending);
  }, [pending, onPendingChange]);

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message);
      onSuccess();
    } else {
      toast.error(state.message);
    }
  }, [state?.timestamp, onSuccess]);

  return (
    <form id="crear-producto" action={action}>
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
            aria-invalid={!!state?.errors?.nombre}
            disabled={pending}
            defaultValue={state?.inputs?.nombre || ""}
          />
          {state?.errors?.nombre && (
            <FieldError>{state.errors.nombre[0]}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="categoria_combo">
            Categoría <span className="text-destructive">*</span>
          </FieldLabel>
          <Combobox
            name="categoria" // <--- este nombre es el nombre del atributo que se manda al server action
            items={categorias}
            itemToStringLabel={(c: CategoriaOption) => c.nombre}
            itemToStringValue={(c: CategoriaOption) => String(c.id)}
          >
            <ComboboxInput
              id="categoria_combo"
              placeholder="Seleccione una categoría."
              showClear
              aria-invalid={!!state?.errors?.categoria}
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
          {state?.errors?.categoria && (
            <FieldError>{state.errors.categoria[0]}</FieldError>
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
              aria-invalid={!!state?.errors?.precio}
              disabled={pending}
              defaultValue={state?.inputs?.precio || ""}
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
          {state?.errors?.precio && (
            <FieldError>{state.errors.precio[0]}</FieldError>
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
            aria-invalid={!!state?.errors?.stock_actual}
            disabled={pending}
            defaultValue={state?.inputs?.stock_actual || ""}
            onInput={(e) => {
              const input = e.currentTarget;
              const validValue = input.value.replace(/[^0-9]/g, "");
              if (input.value !== validValue) {
                input.value = validValue;
              }
            }}
          />
          {state?.errors?.stock_actual && (
            <FieldError>{state.errors.stock_actual[0]}</FieldError>
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
            aria-invalid={!!state?.errors?.stock_minimo}
            disabled={pending}
            defaultValue={state?.inputs?.stock_minimo || ""}
            onInput={(e) => {
              const input = e.currentTarget;
              const validValue = input.value.replace(/[^0-9]/g, "");
              if (input.value !== validValue) {
                input.value = validValue;
              }
            }}
          />
          {state?.errors?.stock_minimo && (
            <FieldError>{state.errors.stock_minimo[0]}</FieldError>
          )}
        </Field>
      </FieldGroup>
    </form>
  );
}

export default function ModalNuevoProducto({
  categorias,
}: PropsModalNuevoProducto) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const handlePendingChange = useCallback((p: boolean) => setIsPending(p), []);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    // Resetear completamente el formulario cuando se cierra
    if (!isOpen) {
      setFormKey((prev) => prev + 1);
    }
  };

  const handleSuccess = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Modal
      title="Nuevo producto"
      description="Agrega un nuevo producto a tu inventario."
      textTriggerButton="Nuevo"
      iconTriggerButton={<Plus className="size-4" />}
      triggerButtonVariant="default"
      open={open}
      onOpenChange={handleOpenChange}
      footer={
        <Button type="submit" form="crear-producto" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar"
          )}
        </Button>
      }
      headerImgSrc="/icecream.svg"
    >
      <FormContent
        key={formKey}
        categorias={categorias}
        onSuccess={handleSuccess}
        onPendingChange={handlePendingChange}
      />
    </Modal>
  );
}
