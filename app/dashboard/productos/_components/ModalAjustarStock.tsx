import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { ProductoRow } from "@/lib/dal/productos";
import { capitalizeFirstLetter } from "@/lib/text";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { useActionState, useState, useEffect, useRef } from "react";
import { AjustarStockFormSchema } from "../_schemas/ajustar-stock.schema";
import { toast } from "sonner";
import { ajustarStock } from "../_actions/ajustar-stock.action";

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
  const [state, action, pending] = useActionState(ajustarStock, undefined);
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>(
    {},
  );
  const processedTimestamp = useRef(state?.timestamp);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);

    const rawFormData = {
      id_producto: formData.get("id_producto")?.toString() || "",
      nuevo_stock: formData.get("nuevo_stock")?.toString() || "",
    };

    const validatedData = AjustarStockFormSchema.safeParse(rawFormData);

    if (validatedData.error) {
      e.preventDefault();
      toast.error("Faltan campos por llenar o hay errores.");
      setClientErrors(
        validatedData.error.flatten((issue) => issue.message).fieldErrors,
      );
      return;
    }

    setClientErrors({});
  };

  useEffect(() => {
    if (!state) return;
    if (processedTimestamp.current === state.timestamp) return;
    processedTimestamp.current = state.timestamp;

    if (state.success) {
      toast.success(state.message);
      onOpenChange(false);
    } else {
      toast.error(state.message);
    }
  }, [state?.timestamp]);

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
      <form id="ajustar_stock" action={action} onSubmit={handleSubmit}>
        <Input name="id_producto" hidden={true} defaultValue={product?.id} />

        <FieldGroup>
          <Field>
            <Input
              type="number"
              name="nuevo_stock"
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
