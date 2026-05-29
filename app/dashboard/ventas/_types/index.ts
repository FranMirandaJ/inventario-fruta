import { ProductoParaVenta } from "@/lib/dal/productos";

export type ItemCarrito = {
    producto: ProductoParaVenta;
    cantidad: number;
};