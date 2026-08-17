import ContenedorPagina from "@/components/ContenedorPagina";
import { Metadata } from "next";
import ModalNuevoUsuario from "./_components/ModalNuevoUsuario";
import TablaUsuarios from "./_components/TablaUsuarios";
import { obtenerUsuariosActivos } from "@/lib/dal/usuarios";

export const metadata: Metadata = {
    title: "Usuarios - FrutaStock",
};

export default async function UsuariosPage(){

    const usuarios = await obtenerUsuariosActivos();

    return(
        <ContenedorPagina
            titulo="Usuarios"
            acciones= {<ModalNuevoUsuario/>}
        >
            <TablaUsuarios data={usuarios} />
        </ContenedorPagina>
    );
}