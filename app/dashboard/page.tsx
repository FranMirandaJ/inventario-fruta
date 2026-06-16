import type { Metadata } from "next";
import ContenedorPagina from "./_components/ContenedorPagina";
import InicioView from "./_components/InicioView";

export const metadata: Metadata = {
  title: "Inicio - FrutaStock",
};

export default function DashboardPage() {
  return (
    <ContenedorPagina titulo="Inicio">
      <InicioView/>
    </ContenedorPagina>
  );
}
