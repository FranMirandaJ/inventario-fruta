import ContenedorPagina from "../_components/ContenedorPagina";
import ModalRegistrarVenta from "./_components/ModalRegistrarVenta";
import { obtenerProductosActivosDisponibles } from "@/lib/dal/productos";

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
