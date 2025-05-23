import { FormaPago } from "../formaPago.model";
import { ResponseOne } from "../respuestas/respuestas-genericas/responseOne.model";

export interface FormaPagoDetailState{
    loading: boolean;
    errorCarga: boolean;
    formaPagoPorId: FormaPago | null; 
}