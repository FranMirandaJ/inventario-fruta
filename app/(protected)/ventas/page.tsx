import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import ContenedorPagina from "@/components/ContenedorPagina";
import TablaVentas from "./_components/TablaVentas";
import FiltrosVentas from "./_components/FiltrosVentas";
import { obtenerProductosActivosDisponibles } from "@/lib/dal/productos";
import { obtenerVentas } from "@/lib/dal/ventas";
import { ensureValidPage } from "@/lib/pagination";

const ModalRegistrarVenta = dynamic(() => import("./_components/ModalRegistrarVenta"));

export const metadata: Metadata = {
  title: "Ventas - FrutaStock",
};

export default async function VentasPage(props: {
  searchParams?: Promise<{ 
    q?: string; 
    desde?: string; 
    hasta?: string; 
    offset?: string;
    page?: string;
    pageSize?: string;
  }>
}) {

  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const desde = searchParams?.desde || "";
  const hasta = searchParams?.hasta || "";
  const offset = searchParams?.offset || "";
  const page = Math.max(1, Number(searchParams?.page) || 1);
  const pageSize = Math.max(1, Number(searchParams?.pageSize) || 5);

  const [productos, { ventas, totalPages }] = await Promise.all([
    obtenerProductosActivosDisponibles(),
    obtenerVentas({
      q: query || undefined,
      desde: desde || undefined,
      hasta: hasta || undefined,
      offset: offset || undefined,
      page,
      pageSize,
    }),
  ]);

  ensureValidPage(page, totalPages, "/ventas", {
    q: query,
    desde,
    hasta,
    offset,
  }, pageSize);

  return (
    <ContenedorPagina
      titulo="Ventas"
      acciones={<ModalRegistrarVenta productos={productos} />}
    >
      <FiltrosVentas />
      <Suspense fallback={<div className="py-12 text-center text-muted-foreground">Cargando ventas...</div>}>
        <TablaVentas ventas={ventas} totalPages={totalPages} />
      </Suspense>
    </ContenedorPagina>
  );
}
