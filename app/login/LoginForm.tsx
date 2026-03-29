"use client";

import { login } from "./login.action";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm({}) {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action}>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo electrónico</Label>
            {state?.errors?.email && (
              <p className="text-red-500">{state.errors.email[0]}</p>
            )}
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Contraseña</Label>
            </div>
            {state?.errors?.password && (
              <p className="text-red-500">{state.errors.password[0]}</p>
            )}
            <Input id="password" name="password" type="password" required />
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
          {pending ? "Ingresando..." : "Ingresar"}
        </Button>
      </CardFooter>
    </form>
  );
}
