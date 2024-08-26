import { FormaPago } from "../formaPago.model";
import { ResponseOne } from "../responseOne.model";

export interface FormaPagoDetailState{
    cargando: boolean;
    errorCarga: boolean;
    formaPagoPorId: FormaPago | null; 
}