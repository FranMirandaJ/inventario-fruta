"use client";

import type { ComponentProps } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useSession } from "@/lib/contexts/session-context";
import { puede, type Permiso } from "@/lib/permisos";

type DropdownMenuItemPermisoProps = Omit<
  ComponentProps<typeof DropdownMenuItem>,
  "disabled"
> & {
  permiso: Permiso;
};

export default function DropdownMenuItemPermiso({
  permiso,
  onClick,
  onSelect,
  ...props
}: DropdownMenuItemPermisoProps) {
  const { rol } = useSession();

  if (!puede(rol, permiso)) {
    return <DropdownMenuItem {...props} disabled />;
  }

  return (
    <DropdownMenuItem onClick={onClick} onSelect={onSelect} {...props} />
  );
}
