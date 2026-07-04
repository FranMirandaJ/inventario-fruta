"use server";

import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const cerrarSesion = async () => {
    await deleteSession();
    redirect("/login");
};
