import { Proveedor } from "../proveedor.model";

export interface ProveedorDetailState {
    cargando: boolean;
    errorCarga: boolean;
    proveedorPorId: Proveedor | null;
}