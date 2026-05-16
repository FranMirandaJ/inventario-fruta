"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/Modal";
import { Plus } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CategoriaOption } from "@/lib/dal/categorias";

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
      footer={<Button>Guardar</Button>}
      headerImgSrc="/icecream.svg"
      //size="4xl"
    >
      <form>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="nombre">Nombre</FieldLabel>
            <Input id="nombre" type="text" placeholder="Nombre del producto" />
            {/* <FieldError>Mensaje de validación</FieldError> */}
          </Field>

          <Field>
            <FieldLabel htmlFor="categoria">Categoría</FieldLabel>
            <Select>
                <SelectTrigger className="w-full">
                    <SelectValue id="categoria" placeholder="Seleccione una categoría." />
                </SelectTrigger>
                <SelectContent>
                <SelectGroup>
                    <SelectLabel>Categorías</SelectLabel>
                    {categorias.map((categoria) => (
                        <SelectItem 
                            key={categoria.id} 
                            value={String(categoria.id)}
                        >
                            {categoria.nombre}
                        </SelectItem>
                    ))}
                </SelectGroup>
                </SelectContent>
            </Select>
            {/* <FieldError>Mensaje de validación</FieldError> */}
          </Field>

          <Field>
            <FieldLabel htmlFor="nombre">Presentación</FieldLabel>
            <Input id="nombre" type="text" placeholder="Opcional" />
            {/* <FieldError>Mensaje de validación</FieldError> */}
          </Field>
        </FieldGroup>
        {/* Aquí irían tus inputs */}
      </form>
    </Modal>
  );
}
