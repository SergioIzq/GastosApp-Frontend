import { IngresoProgramadoByIdRespuesta } from "../respuestas/ingresos/ingresoProgramadoByIdRespuesta.model";
import { IngresoRespuesta } from "../respuestas/ingresos/ingresoRespuesta.model";

export interface IngresoProgramadoDetailState{
    loading: boolean;
    errorCarga: boolean;
    ingresoProgramadoPorId: IngresoProgramadoByIdRespuesta | null;
    errorMessage: string;
    ingresoRespuesta: IngresoRespuesta | null;
}