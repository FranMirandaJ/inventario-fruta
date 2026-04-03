import { Button } from "@/components/ui/button";
import ContenedorPagina from "./_components/ContenedorPagina";
// import AutoBreadcrumb from "./_components/AutoBreadcrumb";

export default async function DashboardPage() {

  return (
    <ContenedorPagina
      titulo="Inicio"
      descripcion="Esto es una prueba para probar las cosas"
      acciones={
        <>
          <Button variant={'outline'}>Hola</Button>
          <Button variant={'outline'}>Hola</Button>
          <Button variant={'outline'}>Hola</Button>
        </>
      }
      // breadcrumbs={<AutoBreadcrumb/>}
    >
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
      <p>esto es una prueba</p>
    </ContenedorPagina>
  );
}
