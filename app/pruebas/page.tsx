import { Button } from "@/components/ui/button";
import ContenedorPagina from "./../dashboard/_components/ContenedorPagina";
import AutoBreadcrumb from "./../../components/AutoBreadcrumb";
import TablaPeriodos, { Periodo } from "./_components/TablaPrueba";

export default function DashboardPage() {


// datos de prueba (Aquí normalmente vendrían de tu base de datos)
const dataDePrueba: Periodo[] = [
  { id: "1", periodoEscolar: "ENE-JUN/2026", totalEventos: 0, totalHoras: 0 },
  { id: "2", periodoEscolar: "AGO-DIC/2025", totalEventos: 4, totalHoras: 8 },
  { id: "3", periodoEscolar: "ENE-JUN/2027", totalEventos: 2, totalHoras: 10 },
  { id: "3", periodoEscolar: "ENE-JUN/2028", totalEventos: 2, totalHoras: 10 },
  { id: "3", periodoEscolar: "ENE-JUN/2029", totalEventos: 2, totalHoras: 10 },
  { id: "3", periodoEscolar: "ENE-JUN/2030", totalEventos: 2, totalHoras: 10 },
  { id: "3", periodoEscolar: "ENE-JUN/2031", totalEventos: 2, totalHoras: 10 },
  { id: "3", periodoEscolar: "ENE-JUN/2032", totalEventos: 2, totalHoras: 10 },
  { id: "3", periodoEscolar: "ENE-JUN/2033", totalEventos: 2, totalHoras: 10 },
];


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
      //breadcrumbs={<AutoBreadcrumb/>}
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
      <TablaPeriodos data={dataDePrueba}/>
    </ContenedorPagina>
  );
}
