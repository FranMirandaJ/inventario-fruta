"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { UsuarioActivo } from "@/lib/dal/usuarios";
import { UserXIcon } from "lucide-react";
import { capitalizeWords } from "@/lib/text";
import { rolLabels } from "@/lib/usuarios";

type Props = {
  usuario: UsuarioActivo | null;
};

export default function AlertModalDeshabilitarUsuario({ usuario }: Props) {
  if (!usuario) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Desactivar usuario"
          color="red"
        >
          <UserXIcon className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deshabilitar usuario</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de deshabilitar al siguiente usuario?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm space-y-3">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-muted-foreground text-xs sm:text-sm">Nombre</span>
            <span className="font-medium wrap-break-word min-w-0">
              {capitalizeWords(usuario.nombre)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-muted-foreground text-xs sm:text-sm">Correo</span>
            <span className="text-xs font-medium wrap-break-word min-w-0">
              {usuario.email}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-muted-foreground text-xs sm:text-sm">Rol</span>
            <span className="font-medium">{rolLabels[usuario.rol]}</span>
          </div>
        </div>

        <span className="text-xs text-muted-foreground">
          Al deshabilitar, este usuario no podrá iniciar sesión.
        </span>

        <form action="">
          <input type="hidden" name="id" value={usuario.id} />
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancelar</AlertDialogCancel>
            <Button type="submit" variant="destructive">
              Deshabilitar
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
