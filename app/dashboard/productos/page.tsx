import { verifySession } from "@/lib/dal/auth";
import { obtenerProductos } from "@/lib/dal/productos";
import ContenedorPagina from "../_components/ContenedorPagina";
//import TablaProductos from "./_components/TablaProductos";

export default async function ProductosPage() {
  await verifySession();
  const productos = await obtenerProductos();
  console.log(productos);
  return (
    <ContenedorPagina titulo="Productos">
      {/* <TablaProductos data={productos} /> */}
      Productos
    </ContenedorPagina>
  );
}
