import { verifySession } from "@/lib/dal/auth";
import { obtenerProductos } from "@/lib/dal/productos";
import ContenedorPagina from "../_components/ContenedorPagina";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import Modal from "@/components/Modal";
//import TablaProductos from "./_components/TablaProductos";

export default async function ProductosPage() {
  await verifySession();
  //const productos = await obtenerProductos();

  return (
    <ContenedorPagina 
      titulo="Productos"
      acciones= {
        <Modal 
          title="Crear Nuevo Producto"
          description="Llena los datos para registrar un nuevo artículo en el inventario."
          textTriggerButton="Nuevo"
          iconTriggerButton={<Plus className="size-4" />}
          triggerButtonVariant="default"
          footer={<Button>Guardar</Button>}
          //size="4xl"
        >
        <form>
          {/* Aquí irían tus inputs */}
          <input type="text" placeholder="Nombre del producto" className="border p-2 w-full" />
        </form>
      </Modal>
      }
    >
      {/* <TablaProductos data={productos} /> */}
      Productos
    </ContenedorPagina>
  );
}
