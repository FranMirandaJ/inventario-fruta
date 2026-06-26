import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import ContenedorPagina from "../_components/ContenedorPagina";
import TablaVentas from "./_components/TablaVentas";
import FiltrosVentas from "./_components/FiltrosVentas";
import { obtenerProductosActivosDisponibles } from "@/lib/dal/productos";
import { obtenerVentas } from "@/lib/dal/ventas";

const ModalRegistrarVenta = dynamic(() => import("./_components/ModalRegistrarVenta"));

export const metadata: Metadata = {
  title: "Ventas - FrutaStock",
};

export default async function VentasPage(props: {
  searchParams?: Promise<{ q?: string; desde?: string; hasta?: string; offset?: string }>
}) {
  const params = await props.searchParams;
  const query = params?.q || "";
  const desde = params?.desde || "";
  const hasta = params?.hasta || "";
  const offset = params?.offset || "";

  const [productos, { ventas }] = await Promise.all([
    obtenerProductosActivosDisponibles(),
    obtenerVentas({
      q: query || undefined,
      desde: desde || undefined,
      hasta: hasta || undefined,
      offset: offset || undefined,
    }),
  ]);

  return (
    <ContenedorPagina
      titulo="Ventas"
      acciones={<ModalRegistrarVenta productos={productos} />}
    >
      <FiltrosVentas />
      <Suspense fallback={<div className="py-12 text-center text-muted-foreground">Cargando ventas...</div>}>
        <TablaVentas ventas={ventas} />
      </Suspense>
    </ContenedorPagina>
  );
}
