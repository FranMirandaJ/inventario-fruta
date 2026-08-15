"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import type { ProductoMasVendido } from "@/lib/dal/productos";

function partirNombre(nombre: string): string[] {
  const palabras = nombre.split(" ");
  const lineas: string[] = [];
  let linea = "";

  for (const palabra of palabras) {
    if (linea && (linea + " " + palabra).length > 13) {
      lineas.push(linea);
      linea = palabra;
    } else {
      linea = linea ? linea + " " + palabra : palabra;
    }
  }

  if (linea) lineas.push(linea);

  if (lineas.length > 1 || lineas[0].length > 13) {
    if (lineas[0].length > 13) {
      const mitad = Math.ceil(lineas[0].length / 2);
      return [lineas[0].slice(0, mitad), lineas[0].slice(mitad)];
    }
    return lineas.slice(0, 2);
  }

  return lineas;
}

function TickEjeY({
  x,
  y,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value?: string | number };
}) {
  const lineas = partirNombre(String(payload?.value ?? ""));

  if (lineas.length === 1) {
    return (
      <text
        x={x}
        y={y}
        textAnchor="end"
        fill="var(--color-muted-foreground)"
        fontSize={13}
      >
        <tspan x={x} dy={4}>
          {lineas[0]}
        </tspan>
      </text>
    );
  }

  return (
    <text
      x={x}
      y={y}
      textAnchor="end"
        fill="var(--color-muted-foreground)"
        fontSize={13}
      >
      <tspan x={x} dy={-7}>
        {lineas[0]}
      </tspan>
      <tspan x={x} dy={15}>
        {lineas[1]}
      </tspan>
    </text>
  );
}

function TooltipPersonalizado({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;

  const { name, value } = payload[0];

  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold">{name}</p>
      <p className="text-muted-foreground">
        <strong>{value}</strong> piezas vendidas
      </p>
    </div>
  );
}

export default function BarrasProductosMasVendidos({
  data,
}: {
  data: ProductoMasVendido[];
}) {
  if (data.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Aún no hay ventas registradas.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
      >
        <CartesianGrid
          horizontal={false}
          strokeDasharray="3 3"
          stroke="var(--color-border)"
        />
        <XAxis
          type="number"
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tick={{ fill: "var(--color-muted-foreground)" }}
        />
        <YAxis
          type="category"
          dataKey="nombre"
          width={100}
          tickLine={false}
          axisLine={false}
          tick={<TickEjeY />}
        />
        <Tooltip
          cursor={{ fill: "var(--color-muted)", opacity: 0.5 }}
          content={(props) => <TooltipPersonalizado {...props} />}
        />
        <Bar
          dataKey="total_vendido"
          name="Piezas vendidas"
          fill="var(--color-primary)"
          radius={[0, 6, 6, 0]}
          maxBarSize={24}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
