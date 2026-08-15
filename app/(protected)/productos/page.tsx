import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { obtenerProductos } from "@/lib/dal/productos";
import { obtenerOpcionesCategoriasProductos } from "@/lib/dal/categorias";
import ContenedorPagina from "@/components/ContenedorPagina";
import TablaProductos from "./_components/TablaProductos";

const ModalNuevoProducto = dynamic(() => import("./_components/ModalNuevoProducto"));

export const metadata: Metadata = {
  title: "Productos - FrutaStock",
};

export default async function ProductosPage() {

  const [productos, opcionesCategorias] = await Promise.all([
    obtenerProductos(),
    obtenerOpcionesCategoriasProductos(),
  ]);

  return (
    <ContenedorPagina 
      titulo="Productos"
      acciones= {
        <ModalNuevoProducto categorias={opcionesCategorias}/>
      }
    >
      <TablaProductos data={productos} categorias={opcionesCategorias} />
    </ContenedorPagina>
  );
}
