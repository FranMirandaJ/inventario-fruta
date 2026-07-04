"use client";

import { useTheme } from "@teispace/next-themes";
import { Button } from "@/components/ui/button";
import ContenedorPagina from "@/components/ContenedorPagina";
import AutoBreadcrumb from "../../components/AutoBreadcrumb";
import TablaPeriodos, { Periodo } from "./_components/TablaPrueba";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Package, History, Sun, Moon, Trash } from "lucide-react";
import Modal from "@/components/Modal";

export default function DashboardPage() {
  const { setTheme, resolvedTheme } = useTheme();
  // datos de prueba (Aquí normalmente vendrían de tu base de datos)
  const dataDePrueba: Periodo[] = [
    { id: "1", periodoEscolar: "ENE-JUN/2026", totalEventos: 0, totalHoras: 0 },
    { id: "2", periodoEscolar: "AGO-DIC/2025", totalEventos: 4, totalHoras: 8 },
    {
      id: "3",
      periodoEscolar: "ENE-JUN/2027",
      totalEventos: 2,
      totalHoras: 10,
    },
    {
      id: "3",
      periodoEscolar: "ENE-JUN/2028",
      totalEventos: 2,
      totalHoras: 10,
    },
    {
      id: "3",
      periodoEscolar: "ENE-JUN/2029",
      totalEventos: 2,
      totalHoras: 10,
    },
    {
      id: "3",
      periodoEscolar: "ENE-JUN/2030",
      totalEventos: 2,
      totalHoras: 10,
    },
    {
      id: "3",
      periodoEscolar: "ENE-JUN/2031",
      totalEventos: 2,
      totalHoras: 10,
    },
    {
      id: "3",
      periodoEscolar: "ENE-JUN/2032",
      totalEventos: 2,
      totalHoras: 10,
    },
    {
      id: "3",
      periodoEscolar: "ENE-JUN/2033",
      totalEventos: 2,
      totalHoras: 10,
    },
  ];

  return (
    <ContenedorPagina
      titulo="Sandbox"
      descripcion="Esto es una página de prueba para probar componentes"
      acciones={
        <>
          <Button variant="outline" size="icon" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
            {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button variant={"outline"}>Hola</Button>
          <Button variant={"outline"}>Hola</Button>
          <Button variant={"outline"}>Hola</Button>
        </>
      }
      //breadcrumbs={<AutoBreadcrumb/>}
    >
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>

      <Modal
        title="¿Estás completamente seguro?"
        description="Esta acción no se puede deshacer y borrará los datos permanentemente."
        textTriggerButton="Eliminar"
        iconTriggerButton={<Trash className="size-4" />}
        triggerButtonVariant="destructive"
        footer={<Button variant="destructive">Sí, eliminar</Button>}
      />

      <TablaPeriodos data={dataDePrueba} />
      <Tabs defaultValue="metricas" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger
            value="metricas"
            className="flex items-center gap-2 h-full"
          >
            <LayoutDashboard className="size-4" />
            <span className="hidden sm:inline">Métricas</span>
          </TabsTrigger>

          <TabsTrigger
            value="productos"
            className="flex items-center gap-2 h-full"
          >
            <Package className="size-4" />
            <span className="hidden sm:inline">Productos</span>
          </TabsTrigger>

          <TabsTrigger
            value="ventas"
            className="flex items-center gap-2 h-full"
          >
            <History className="size-4" />
            <span className="hidden sm:inline">Ventas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metricas">
          <p className="text-muted-foreground">metricas</p>
        </TabsContent>

        <TabsContent value="productos">
          <p className="text-muted-foreground">productos</p>
        </TabsContent>

        <TabsContent value="ventas">
          <p className="text-muted-foreground">ventas</p>
        </TabsContent>
      </Tabs>
    </ContenedorPagina>
  );
}
