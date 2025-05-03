import { IngresoProgramadoByIdRespuesta } from "../respuestas/ingresoProgramadoByIdRespuesta.model";
import { IngresoRespuesta } from "../respuestas/ingresoRespuesta.model";

export interface IngresoProgramadoDetailState{
    loading: boolean;
    errorCarga: boolean;
    ingresoProgramadoPorId: IngresoProgramadoByIdRespuesta | null;
    errorMessage: string;
    ingresoRespuesta: IngresoRespuesta | null;
}