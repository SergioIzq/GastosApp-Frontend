import { Cuenta } from "../cuenta.model";

export interface CuentaDetailState{
    cargando: boolean;
    errorCarga: boolean;
    cuentaPorId: Cuenta | null; 
}