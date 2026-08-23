import ContenedorPagina from "@/components/ContenedorPagina";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import TablaUsuarios from "./_components/TablaUsuarios";
import { obtenerUsuariosActivos } from "@/lib/dal/usuarios";
import { requirePermiso } from "@/lib/dal/auth";
import { PERMISOS } from "@/lib/permisos";

const ModalNuevoUsuario = dynamic(() => import('./_components/ModalNuevoUsuario'));

export const metadata: Metadata = {
    title: "Usuarios - FrutaStock",
};

export default async function UsuariosPage(){
    await requirePermiso(PERMISOS.usuariosVer);

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