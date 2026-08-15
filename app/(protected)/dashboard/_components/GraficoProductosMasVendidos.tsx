"use client";

import dynamic from "next/dynamic";
import type { ProductoMasVendido } from "@/lib/dal/productos";

const BarrasProductosMasVendidos = dynamic(
  () => import("./BarrasProductosMasVendidos"),
  { ssr: false },
);

export default function GraficoProductosMasVendidos({
  data,
}: {
  data: ProductoMasVendido[];
}) {
  return <BarrasProductosMasVendidos data={data} />;
}
