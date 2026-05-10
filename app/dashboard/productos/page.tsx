import { verifySession } from "@/lib/dal/auth";
import { obtenerProductos } from "@/lib/dal/productos";
import ContenedorPagina from "../_components/ContenedorPagina";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import Modal from "@/components/Modal";
import { Input } from "@/components/ui/input";
//import TablaProductos from "./_components/TablaProductos";

export default async function ProductosPage() {
  await verifySession();
  const productos = await obtenerProductos();

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
          headerImgSrc="/icecream.svg"
          //size="4xl"
        >
        <form>
          {/* Aquí irían tus inputs */}
          <Input type="text" placeholder="Nombre del producto" />
        </form>
      </Modal>
      }
    >
      {/* <TablaProductos data={productos} /> */}
      Productos
    </ContenedorPagina>
  );
}
