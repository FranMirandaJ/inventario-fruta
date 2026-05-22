import { verifySession } from "@/lib/dal/auth";
import { obtenerProductos } from "@/lib/dal/productos";
import { obtenerOpcionesCategoriasProductos } from "@/lib/dal/categorias";
import ContenedorPagina from "../_components/ContenedorPagina";
import ModalNuevoProducto from "./_components/ModalNuevoProducto";
//import TablaProductos from "./_components/TablaProductos";

export default async function ProductosPage() {
  await verifySession();
  const productos = await obtenerProductos();
  const opcionesCategorias = await obtenerOpcionesCategoriasProductos();

  return (
    <ContenedorPagina 
      titulo="Productos"
      acciones= {
        <ModalNuevoProducto categorias={opcionesCategorias}/>
      }
    >
      {/* <TablaProductos data={productos} /> */}
      Productos
    </ContenedorPagina>
  );
}
