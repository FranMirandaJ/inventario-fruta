import { ProductoParaVenta } from "@/lib/dal/productos";

export type ItemCarrito = {
    producto: ProductoParaVenta;
    cantidad: number;
};

export type ConfirmarVentaItem = {
    id_producto: number;
    cantidad: number;
};

export type PropsCardVenta = {
    
};