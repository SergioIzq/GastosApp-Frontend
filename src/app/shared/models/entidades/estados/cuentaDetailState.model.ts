import { Cuenta } from "../cuenta.model";

export interface CuentaDetailState{
    loading: boolean;
    errorCarga: boolean;
    cuentaPorId: Cuenta | null; 
}