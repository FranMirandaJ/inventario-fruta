"use client";

import { login } from "./login.action";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginForm({}) {

  const [state, action, pending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <form action={action}>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
            {state?.errors?.email && (
              <Label
                className={state?.errors?.email ? "text-red-500" : "text-black"}
              >
                {state.errors.email[0]}
              </Label>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Contraseña</Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="pr-10"
                required
              />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </Button>
            </div>

            {state?.errors?.password && (
              <Label
                className={
                  state?.errors?.password ? "text-red-500" : "text-black"
                }
              >
                {state.errors.password[0]}
              </Label>
            )}

            {state?.message && (
              <Alert className="max-w-md mt-4" variant="destructive">
                <AlertCircleIcon />
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-6">
        <Button
          type="submit"
          className="w-full bg-green-600 text-white hover:bg-green-700 cursor-pointer"
          variant="secondary"
          disabled={pending}
        >
          {pending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {pending ? "Ingresando..." : "Ingresar"}
        </Button>
      </CardFooter>
    </form>
  );
}
