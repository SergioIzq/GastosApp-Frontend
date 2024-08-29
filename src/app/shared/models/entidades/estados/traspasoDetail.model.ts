import { Cuenta } from "../cuenta.model";
import { ResponseData } from "../responseData.model";
import { Traspaso } from "../traspaso.model";

export interface TraspasoDetailState {
    loading: boolean;
    errorCarga: boolean;
    traspasoPorId: Traspaso | null;    
    cuentas: ResponseData<Cuenta> | null;
}