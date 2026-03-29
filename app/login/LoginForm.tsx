"use client";

import { login } from "./login.action";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm({}) {

    const [state, action, pending] = useActionState(login, undefined);

  return (
    <>
      <CardContent>
        <form action={action}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button 
            type="submit"
            className="w-full bg-green-600 text-white hover:bg-green-700 cursor-pointer"
            variant="secondary"
            onClick={() => {
                console.log("click")
            }}
        >
          Ingresar
        </Button>
      </CardFooter>
    </>
  );
}
