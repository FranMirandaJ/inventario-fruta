"use client";

import Modal from "@/components/Modal";



export default function ModalRegenerarPassword({}) {
    return (
        <Modal
            title="Regenerar contraseña"
            description={
                <>
                    Genera una nueva contraseña aleatoria y segura para este usuario.
                    <br />
                    Cópiala y compártela de forma segura, ya que no se mostrará de nuevo.
                </>
            }
        >

        </Modal>
    );
};