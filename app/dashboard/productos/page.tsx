import { Plus } from "lucide-react";
import ContenedorPagina from "../_components/ContenedorPagina";
import { Button } from "@/components/ui/button";

export default function ProductosPage() {
  return (
    <ContenedorPagina 
      titulo="Productos"
      acciones={
        <Button >
          <Plus/>
          Nuevo
        </Button>
      }
    >
      hola
    </ContenedorPagina>
  );
}
