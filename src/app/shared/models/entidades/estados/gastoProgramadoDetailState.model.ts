import { GastoProgramadoByIdRespuesta } from "../respuestas/gastoProgramadoByIdRespuesta.model";
import { GastoRespuesta } from "../respuestas/gastoRespuesta.model";

export interface GastoProgramadoDetailState{
    loading: boolean;
    errorCarga: boolean;
    gastoProgramadoPorId: GastoProgramadoByIdRespuesta | null;
    errorMessage: string;
    gastoRespuesta: GastoRespuesta | null;
}