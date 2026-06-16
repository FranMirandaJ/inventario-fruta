import type { Metadata } from "next";
import dynamic from "next/dynamic";
import ContenedorPagina from "../_components/ContenedorPagina";
import { obtenerProductosActivosDisponibles } from "@/lib/dal/productos";

const ModalRegistrarVenta = dynamic(() => import("./_components/ModalRegistrarVenta"));

export const metadata: Metadata = {
  title: "Ventas - FrutaStock",
};

export default async function VentasPage() {

  const productos = await obtenerProductosActivosDisponibles();
  
  return (
    <ContenedorPagina 
      titulo="Ventas"
      acciones={ <ModalRegistrarVenta productos={productos}/> }

    >
      HOLA
    </ContenedorPagina>
  );
}
