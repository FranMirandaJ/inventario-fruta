"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { UsuarioActivo } from "@/lib/dal/usuarios";
import { capitalizeWords } from "@/lib/text";
import { rolLabels } from "@/lib/permisos";
import { useTransition } from "react";
import { deshabilitarUsuario } from "../_actions/deshabilitar-usuario";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Props = {
  usuario: UsuarioActivo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AlertModalDeshabilitarUsuario({
  usuario,
  open,
  onOpenChange,
}: Props) {
  const [pending, startTransition] = useTransition();

  const handleConfirm = () => {
    if (!usuario) return;

    startTransition(async () => {
      const result = await deshabilitarUsuario(usuario.id);

      if (result?.success) {
        toast.success(result.message);
        onOpenChange(false);
      } else {
        toast.error(
          result?.message || "Ocurrió un error al deshabilitar al usuario.",
        );
      }
    });
  };

  if (!usuario) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deshabilitar usuario</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de deshabilitar al siguiente usuario?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm space-y-3">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-muted-foreground text-xs sm:text-sm">
              Nombre
            </span>
            <span className="font-medium wrap-break-word min-w-0">
              {capitalizeWords(usuario.nombre)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-muted-foreground text-xs sm:text-sm">
              Correo
            </span>
            <span className="text-xs font-medium wrap-break-word min-w-0">
              {usuario.email}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-muted-foreground text-xs sm:text-sm">
              Rol
            </span>
            <span className="font-medium">{rolLabels[usuario.rol]}</span>
          </div>
        </div>

        <span className="text-xs text-muted-foreground">
          Al deshabilitar, este usuario no podrá iniciar sesión.
        </span>

        <AlertDialogFooter>
          <AlertDialogCancel type="button" disabled={pending}>Cancelar</AlertDialogCancel>
          <Button variant="destructive" onClick={handleConfirm} disabled={pending}>
           {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deshabilitando...
              </>
            ) : (
              "Deshabilitar"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
