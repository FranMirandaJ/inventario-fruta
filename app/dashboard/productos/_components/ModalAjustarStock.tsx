import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { ProductoRow } from "@/lib/dal/productos";
import { capitalizeFirstLetter } from "@/lib/text";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { useActionState } from "react";

type Props = {
  product: ProductoRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ModalAjustarStock({
  product,
  open,
  onOpenChange,
}: Props) {

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
  };

  return (
    <Modal
      title="Ajustar cantidad"
      description={
        <>
          Ajusta el stock de{" "}
          <strong>"{capitalizeFirstLetter(product?.nombre)}"</strong>.
        </>
      }
      open={open}
      onOpenChange={onOpenChange}
      showTriggerButton={false}
      size="sm"
      footer={
        <>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
            </Button>
            <Button type="submit" form="ajustar_stock">
            {false ? (
                <>
                <Loader2 className="size-4 animate-spin" />
                Guardando...
                </>
            ) : (
                "Guardar"
            )}
            </Button>
        </>
      }
    >
      <form id="ajustar_stock" onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <Input
              type="number"
              name="stock_actual"
              step={1}
              min={0}
              className="text-center"
              //aria-invalid={!!getFieldErrors("nombre")}
              //disabled={pending}
              defaultValue={product?.stock_actual}
            />
            {/* {getFieldErrors("nombre") && (
              <FieldError>{getFieldErrors("nombre")![0]}</FieldError>
            )} */}
          </Field>
        </FieldGroup>
      </form>
    </Modal>
  );
}
