import ContenedorPagina from "../_components/ContenedorPagina";
import { Button } from "@/components/ui/button";
import ModalRegistrarVenta from "./_components/ModalRegistrarVenta";

export default function VentasPage() {
  return (
    <ContenedorPagina 
      titulo="Ventas"
      acciones={ <ModalRegistrarVenta/> }
      
    >
      HOLA
    </ContenedorPagina>
  );
}
