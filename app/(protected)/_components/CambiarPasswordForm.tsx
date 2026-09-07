"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { cambiarPassword } from "../_actions/cambiar-password.action";
import { cerrarSesion } from "../_actions/navbar.action";

export default function CambiarPasswordForm({ nombre }: { nombre: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(cambiarPassword, undefined);
  const processedTimestamp = useRef(state?.timestamp);

  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmacion, setShowConfirmacion] = useState(false);

  const getFieldErrors = (field: "password_actual" | "password" | "password_confirmacion") =>
    state?.errors?.[field];

  useEffect(() => {
    if (!state?.timestamp) return;
    if (processedTimestamp.current === state.timestamp) return;
    processedTimestamp.current = state.timestamp;

    if (state.success) {
      toast.success(state.message);
      router.replace("/dashboard");
    } else {
      toast.error(state.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.timestamp, router]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 bg-muted">

      <Card className="w-full max-w-md bg-card">
        <CardHeader>
            <CardTitle className="text-center">Cambiar contraseña</CardTitle>
          <CardDescription className="text-center">
            Hola, {nombre}. Por seguridad, debes establecer una nueva
            contraseña antes de continuar.
          </CardDescription>
        </CardHeader>

        <form action={action}>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password_actual">
                  Contraseña actual<span className="text-destructive">*</span>
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="password_actual"
                    name="password_actual"
                    type={showActual ? "text" : "password"}
                    className="pr-10"
                    placeholder="Tu contraseña actual"
                    required
                    autoComplete="current-password"
                    aria-invalid={!!getFieldErrors("password_actual")}
                    disabled={pending}
                  />
                  <Button
                    type="button"
                    onClick={() => setShowActual((prev) => !prev)}
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                    aria-label={showActual ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showActual ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
                {getFieldErrors("password_actual") && (
                  <FieldError>{getFieldErrors("password_actual")![0]}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">
                  Nueva contraseña<span className="text-destructive">*</span>
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showNueva ? "text" : "password"}
                    className="pr-10"
                    placeholder="Mínimo 6 caracteres"
                    required
                    autoComplete="new-password"
                    aria-invalid={!!getFieldErrors("password")}
                    disabled={pending}
                  />
                  <Button
                    type="button"
                    onClick={() => setShowNueva((prev) => !prev)}
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                    aria-label={showNueva ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showNueva ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
                {getFieldErrors("password") && (
                  <FieldError>{getFieldErrors("password")![0]}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password_confirmacion">
                  Confirmar nueva contraseña
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="password_confirmacion"
                    name="password_confirmacion"
                    type={showConfirmacion ? "text" : "password"}
                    className="pr-10"
                    placeholder="Repite tu nueva contraseña"
                    required
                    autoComplete="new-password"
                    aria-invalid={!!getFieldErrors("password_confirmacion")}
                    disabled={pending}
                  />
                  <Button
                    type="button"
                    onClick={() => setShowConfirmacion((prev) => !prev)}
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                    aria-label={showConfirmacion ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showConfirmacion ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
                {getFieldErrors("password_confirmacion") && (
                  <FieldError>
                    {getFieldErrors("password_confirmacion")![0]}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>
          </CardContent>

          <CardFooter className="mt-4 flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full cursor-pointer"
              variant="default"
              disabled={pending}
            >
              {pending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {pending ? "Guardando..." : "Guardar y continuar"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-200 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/50"
              onClick={async () => await cerrarSesion()}
            >
              <LogOut className="mr-2 size-4" />
              Cerrar sesión
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}