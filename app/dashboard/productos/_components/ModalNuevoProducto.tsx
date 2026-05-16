"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/Modal";
import { Plus } from "lucide-react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { CategoriaOption } from "@/lib/dal/categorias";
import { useActionState, useState } from "react";
import { crearProducto } from "../_actions/productos.action";
import type { FormState } from "../_actions/productos.schema";

type PropsModalNuevoProducto = {
    categorias : CategoriaOption[];
};

export default function ModalNuevoProducto({categorias} : PropsModalNuevoProducto) {


  return (
    <Modal
      title="Nuevo producto"
      description="Agrega un nuevo producto a tu inventario."
      textTriggerButton="Nuevo"
      iconTriggerButton={<Plus className="size-4" />}
      triggerButtonVariant="default"
      footer={<Button type="submit" form="producto-form">Guardar</Button>}
      headerImgSrc="/icecream.svg"
    >
      <form >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="nombre">Nombre</FieldLabel>
            <Input id="nombre" type="text" name="nombre" placeholder="Nombre del producto" />
            {/* <FieldError>Error de validación</FieldError> */}
          </Field>

          <Field>
            <FieldLabel htmlFor="categoria">Categoría</FieldLabel>
            <Combobox
              items={categorias}
              itemToStringValue={(c: CategoriaOption | null) => c?.nombre ?? ""}
            >
              <ComboboxInput placeholder="Seleccione una categoría." showClear />
              <ComboboxContent
                onWheel={(e) => e.stopPropagation()}
                className="pointer-events-auto"
              >
                <ComboboxEmpty>No se encontraron categorías.</ComboboxEmpty>
                <ComboboxList>
                  {(categoria: CategoriaOption) => (
                    <ComboboxItem key={categoria.id} value={categoria.nombre}>
                      {categoria.nombre}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            {/* <FieldError>Error de validación</FieldError> */}
          </Field>

          <Field>
            <FieldLabel htmlFor="presentacion">Presentación</FieldLabel>
            <Input id="presentacion" type="text" name="presentacion" placeholder="Opcional" />
            {/* <FieldError>Error de validación</FieldError> */}
          </Field>
          
        </FieldGroup>

      </form>
    </Modal>
  );
}
