import type { Metadata } from "next";
import dynamic from "next/dynamic";
import ContenedorPagina from "../_components/ContenedorPagina";
import TablaVentas from "./_components/TablaVentas";
import { obtenerProductosActivosDisponibles } from "@/lib/dal/productos";
import { obtenerVentas } from "@/lib/dal/ventas";

const ModalRegistrarVenta = dynamic(() => import("./_components/ModalRegistrarVenta"));

export const metadata: Metadata = {
  title: "Ventas - FrutaStock",
};

export default async function VentasPage() {

  const [productos, ventas] = await Promise.all([
    obtenerProductosActivosDisponibles(),
    obtenerVentas(),
  ]);
  
  return (
    <ContenedorPagina 
      titulo="Ventas"
      acciones={ <ModalRegistrarVenta productos={productos}/> }

    >
      <TablaVentas ventas={ventas} />
    </ContenedorPagina>
  );
}
