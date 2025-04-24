import { IngresoByIdRespuesta } from "../respuestas/ingresoByIdRespuesta.model";
import { IngresoRespuesta } from "../respuestas/ingresoRespuesta.model";

export interface IngresoDetailState {
    loading: boolean;
    errorCarga: boolean;
    ingresoPorId: IngresoByIdRespuesta | null;
    errorMessage: string;
    ingresoRespuesta: IngresoRespuesta | null;
}