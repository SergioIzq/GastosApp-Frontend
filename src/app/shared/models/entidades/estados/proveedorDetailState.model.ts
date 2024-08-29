import { Proveedor } from "../proveedor.model";

export interface ProveedorDetailState {
    loading: boolean;
    errorCarga: boolean;
    proveedorPorId: Proveedor | null;
}