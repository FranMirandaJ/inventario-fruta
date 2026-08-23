"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/contexts/session-context";
import { puede, type Permiso } from "@/lib/permisos";

type BotonPermisoProps = Omit<ComponentProps<typeof Button>, "disabled"> & {
  permiso: Permiso;
};

export default function BotonPermiso({
  permiso,
  onClick,
  ...props
}: BotonPermisoProps) {
  const { rol } = useSession();

  if (!puede(rol, permiso)) {
    return <Button {...props} disabled />;
  }

  return <Button onClick={onClick} {...props} />;
}
