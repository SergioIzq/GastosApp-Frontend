import { IngresoByIdRespuesta } from "../respuestas/ingresos/ingresoByIdRespuesta.model";
import { IngresoRespuesta } from "../respuestas/ingresos/ingresoRespuesta.model";

export interface IngresoDetailState {
    loading: boolean;
    errorCarga: boolean;
    ingresoPorId: IngresoByIdRespuesta | null;
    errorMessage: string;
    ingresoRespuesta: IngresoRespuesta | null;
}