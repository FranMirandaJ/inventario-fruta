"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut, X } from "lucide-react";
import { SessionPayload } from "@/lib/definitions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cerrarSesion } from "../_actions/dashboardNavbar.action";

const obtenerInicialesAvatar = (nombre: string) => {
  if (!nombre) return "US";
  const palabras = nombre.trim().split(/\s+/); // Separa por espacios

  if (palabras.length >= 2) {
    // Primera letra de la primera palabra + Primera letra de la última palabra
    return (palabras[0][0] + palabras[palabras.length - 1][0]).toUpperCase();
  }
  // Si solo tiene un nombre, toma las primeras dos letras
  return nombre.substring(0, 2).toUpperCase();
};

export default function DashboardNavbar({
  sessionData,
}: {
  sessionData: SessionPayload;
}) {
  const inicialesUsuario = obtenerInicialesAvatar(sessionData.nombre);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="px-4 py-2 bg-white/80 backdrop-blur-md sm:flex sm:items-center sm:justify-between shadow-xl ring-1 ring-gray-900/5 sticky top-0 z-50">
      <section className="flex w-full justify-between items-center sm:w-auto">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary  bg-green-600">
            <span className="text-2xl font-extrabold text-primary-foreground text-white">
              F
            </span>
          </div>

          <div className="flex flex-col justify-center">
            <span className="font-bold text-gray-900 text-lg leading-none">
              FrutaStock
            </span>
            <span className="text-sm text-gray-500 capitalize mt-1 leading-none">
              Hola, {sessionData.nombre.split(" ")[0]}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          className="size-12 p-0 text-gray-700 sm:hidden cursor-pointer hover:bg-gray-200 hover:text-gray-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="size-8" /> : <Menu className="size-8" />}
        </Button>
      </section>

      <div
        className={`w-full overflow-hidden transition-all duration-300 ease-in-out sm:flex sm:w-auto sm:items-center sm:gap-6 sm:overflow-visible ${
          isMenuOpen
            ? "max-h-100 opacity-100 mt-4"
            : "max-h-0 opacity-0 sm:max-h-none sm:opacity-100 sm:mt-0"
        }`}
      >
        <Separator className="mb-2 bg-gray-300 sm:hidden" />
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
          <Button
            variant={"ghost"}
            className="text-gray-600 hover:bg-gray-200 w-full justify-start px-2 rounded hover:text-gray-900 sm:w-auto sm:justify-center"
            onClick={() => {
              setIsMenuOpen(false);
            }}
          >
            Inicio
          </Button>
          <Button
            variant={"ghost"}
            className="text-gray-600 hover:bg-gray-200 w-full justify-start px-2 rounded hover:text-gray-900 sm:w-auto sm:justify-center"
            onClick={() => {
              setIsMenuOpen(false);
            }}
          >
            Catálogos
          </Button>
          <Button
            variant={"ghost"}
            className="text-gray-600 hover:bg-gray-200 w-full justify-start px-2 rounded hover:text-gray-900 sm:w-auto sm:justify-center"
            onClick={() => {
              setIsMenuOpen(false);
            }}
          >
            Ventas
          </Button>
        </div>
      </div>

      <div className={`w-full sm:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <Separator className="my-2 bg-gray-300" />
        <Button
          variant="ghost"
          className="text-gray-600 w-full justify-start px-3 rounded hover:text-gray-900 hover:bg-gray-200"
          onClick={() => {
            setIsMenuOpen(false);
          }}
        >
          <Avatar className="mr-2 size-6 border border-gray-400">
            <AvatarFallback className="bg-green-100 text-green-700 font-bold text-[11px]">
              {inicialesUsuario}
            </AvatarFallback>
          </Avatar>
          Mi Perfil
        </Button>
        <Button
          variant="ghost"
          className="text-red-600 hover:text-red-700 hover:bg-red-200 w-full justify-start px-3 rounded mt-1"
          onClick={async () => await cerrarSesion()}
        >
          <LogOut className="mr-2 size-4" />
          Cerrar Sesión
        </Button>
      </div>

      <div className="hidden sm:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative size-10 rounded-full p-0 ring-1 ring-gray-300"
            >
              <Avatar className="size-10 border border-gray-200 hover:ring-2 hover:ring-green-600 hover:ring-offset-2 transition-all">
                <AvatarFallback className="bg-green-100 text-green-700 font-bold">
                  {inicialesUsuario}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-white border-gray-400 hidden sm:block"
          >
            <DropdownMenuItem className="cursor-pointer text-gray-700 hover:text-gray-900 hover:bg-gray-200">
              <User className="mr-2 size-4" />
              <span>Mi perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 hover:bg-red-200 hover:text-red-700"
              onClick={async() => await cerrarSesion()}
            >
              <LogOut className="mr-2 size-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
