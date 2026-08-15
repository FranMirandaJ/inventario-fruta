import type { Metadata } from "next";
import { obtenerCategoriasStatsInicio } from "@/lib/dal/categorias";
import { obtenerAlertasStock, obtenerNProductosMasVendidos } from "@/lib/dal/productos";
import ContenedorPagina from "@/components/ContenedorPagina";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, TriangleAlert, FileCheck } from "lucide-react";
import { capitalizeWords } from "@/lib/text";
import { formatCurrency } from "@/lib/money";
import { cn } from "@/lib/utils";
import GraficoProductosMasVendidos from "./_components/GraficoProductosMasVendidos";

export const metadata: Metadata = {
  title: "Inicio - FrutaStock",
};

export default async function DashboardPage() {

  const [categoriasStats, alertasStock, productosMasVendidos] = await Promise.all([
    obtenerCategoriasStatsInicio(),
    obtenerAlertasStock(), //obtiene solo 5 alertas por defecto
    obtenerNProductosMasVendidos(), //obtiene por defecto el top 5 (n = 5)
  ]);

  return (
    <ContenedorPagina titulo="Inicio">
      {/* ==== TARJETAS DE STATS DE CATEGORIAS ==== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {categoriasStats.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="flex flex-col">
              <p className="text-muted-foreground text-md tracking-wide font-semibold">
                {capitalizeWords(cat.nombre)}
              </p>

              <CardTitle className="font-bold text-2xl">
                {cat.total_stock}
              </CardTitle>

              <p className="text-muted-foreground text-sm tracking-wide">
                unidades en stock
              </p>

              <span className="text-muted-foreground text-sm tracking-wide mt-2.5">
                <strong>{formatCurrency(cat.valor_inventario)}</strong> en
                inventario
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ==== ALERTAS DE STOCK Y TOP PRODUCTOS MAS VENDIDOS ==== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {alertasStock.total_alertas > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TriangleAlert className="size-5 text-destructive inline" />
                <span>Alertas de Stock ({alertasStock.total_alertas})</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              {alertasStock.alertas.map((alerta) => (
                <div
                  key={alerta.id}
                  className={cn(
                    "flex flex-col gap-6 rounded-xl py-4 shadow-sm px-4",
                    alerta.stock_actual === 0
                      ? "bg-red-100 dark:bg-red-950/60"
                      : "bg-yellow-100 dark:bg-yellow-950/60",
                  )}
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <p>{capitalizeWords(alerta.nombre)}</p>
                      <p className="text-muted-foreground">
                        {capitalizeWords(alerta.categoria_nombre)}
                      </p>
                    </div>
                    <div>
                      <p
                        className={cn(
                          "font-semibold",
                          alerta.stock_actual === 0
                            ? "text-red-700 dark:text-red-400"
                            : "text-yellow-700 dark:text-yellow-400",
                        )}
                      >
                        {alerta.stock_actual} piezas
                      </p>
                      <p className="text-muted-foreground">
                        {alerta.stock_actual > 0
                          ? `Mínimo: ${alerta.stock_minimo}`
                          : "Agotado"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>

            {alertasStock.total_alertas > alertasStock.alertas.length && (
              <CardFooter className="flex justify-center text-muted-foreground text-sm font-semibold">
                y {alertasStock.total_alertas - alertasStock.alertas.length} más…
              </CardFooter>
            )}
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/15">
                <FileCheck className="size-5 text-primary" />
              </span>
              <p className="font-semibold mt-3">Todo en orden</p>
              <p className="text-muted-foreground text-sm">
                No hay alertas de stock
              </p>
            </CardContent>
          </Card>
        )}

        {/* ==== CHART TOP 5 PRODUCTOS MAS VENDIDOS ==== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="size-5 text-primary inline" />
              <span>Productos más vendidos</span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <GraficoProductosMasVendidos data={productosMasVendidos} />
          </CardContent>
        </Card>
      </div>

    </ContenedorPagina>
  );
}
