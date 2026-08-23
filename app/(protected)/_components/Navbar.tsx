"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@teispace/next-themes";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut, X, Sun, Moon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cerrarSesion } from "../_actions/navbar.action";
import { obtenerInicialesAvatar } from "@/lib/text";
import { useSession } from "@/lib/contexts/session-context";
import { puede, PERMISOS, type Permiso } from "@/lib/permisos";

export default function Navbar() {

  const currentSession = useSession();

  const inicialesUsuario = obtenerInicialesAvatar(currentSession.nombre);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [setTheme, resolvedTheme]);

  const enlaces: { label: string; href: string; permiso: Permiso }[] = [
    { label: "Inicio", href: "/dashboard", permiso: PERMISOS.dashboardVer },
    { label: "Productos", href: "/productos", permiso: PERMISOS.productosVer },
    { label: "Ventas", href: "/ventas", permiso: PERMISOS.ventasVer },
    { label: "Usuarios", href: "/usuarios", permiso: PERMISOS.usuariosVer },
  ];

  const enlacesPermitidos = enlaces.filter((enlace) =>
    puede(currentSession.rol, enlace.permiso),
  );

  const estaActivo = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="px-4 py-2 bg-background/95 sm:flex sm:items-center sm:justify-between shadow-xl ring-1 ring-border sticky top-0 z-50">
      <section className="flex w-full justify-between items-center sm:w-auto">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-green-600">
            <span className="text-2xl font-extrabold text-white">F</span>
          </div>

          <div className="flex flex-col justify-center">
            <span className="font-bold text-foreground text-md leading-none">
              FrutaStock
            </span>
            <span className="text-sm text-muted-foreground capitalize mt-1 leading-none truncate">
              Hola, {currentSession.nombre.split(" ")[0]}.
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          className="size-12 p-0 text-muted-foreground sm:hidden cursor-pointer hover:bg-muted hover:text-foreground"
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
        <Separator className="mb-2 bg-border sm:hidden" />
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
          {enlacesPermitidos.map((enlace) => (
            <Button
              key={enlace.href}
              variant="ghost"
              className={`w-full justify-start px-2 rounded sm:w-auto sm:justify-center transition-all duration-200 ${
                estaActivo(enlace.href)
                  ? "text-green-700 font-bold hover:bg-transparent hover:text-green-700 dark:text-green-400 dark:hover:text-green-400"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              asChild
            >
              <Link href={enlace.href} onClick={() => setIsMenuOpen(false)}>
                {enlace.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <div className={`w-full sm:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <Separator className="my-2 bg-border" />

        <Button
          variant="ghost"
          className="text-muted-foreground w-full justify-start px-3 rounded hover:text-foreground hover:bg-muted"
          onClick={() => setIsMenuOpen(false)}
        >
          <Avatar className="mr-2 size-6 border border-border">
            <AvatarFallback className="bg-green-100 text-green-700 font-bold text-[11px] dark:bg-green-900 dark:text-green-300">
              {inicialesUsuario}
            </AvatarFallback>
          </Avatar>
          Mi Perfil
        </Button>

        <Button
          variant="ghost"
          className="text-muted-foreground w-full justify-start px-3 rounded hover:text-foreground hover:bg-muted"
          onClick={toggleTheme}
        >
          {resolvedTheme === "dark" ? (
            <Sun className="mr-2 size-4" />
          ) : (
            <Moon className="mr-2 size-4" />
          )}
          {resolvedTheme === "dark" ? "Modo Claro" : "Modo Oscuro"}
        </Button>

        <Button
          variant="ghost"
          className="text-red-600 hover:text-red-700 hover:bg-red-200 w-full justify-start px-3 rounded mt-1 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/50"
          onClick={async () => await cerrarSesion()}
        >
          <LogOut className="mr-2 size-4" />
          Cerrar Sesión
        </Button>
      </div>

      <div className="hidden sm:flex sm:items-center sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={toggleTheme}
          aria-label={resolvedTheme === "dark" ? "Modo Claro" : "Modo Oscuro"}
        >
          {resolvedTheme === "dark" ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
        </Button>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative size-10 rounded-full p-0 ring-1 ring-border"
            >
              <Avatar className="size-10 border border-border hover:ring-2 hover:ring-green-600 hover:ring-offset-2 transition-all dark:hover:ring-green-500">
                <AvatarFallback className="bg-green-100 text-green-700 font-bold dark:bg-green-900 dark:text-green-300">
                  {inicialesUsuario}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-xl"
          >
            <DropdownMenuItem className="group cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted">
              <User className="mr-2 size-4 text-muted-foreground group-hover:text-foreground" />
              <span>Mi perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 hover:bg-red-200 hover:text-red-700 dark:text-red-400 dark:focus:text-red-300 dark:focus:bg-red-900/30 dark:hover:bg-red-900/50 dark:hover:text-red-300"
              onClick={async () => await cerrarSesion()}
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
