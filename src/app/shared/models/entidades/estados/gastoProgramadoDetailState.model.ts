import { GastoProgramadoByIdRespuesta } from "../respuestas/gastos/gastoProgramadoByIdRespuesta.model";
import { GastoRespuesta } from "../respuestas/gastos/gastoRespuesta.model";

export interface GastoProgramadoDetailState{
    loading: boolean;
    errorCarga: boolean;
    gastoProgramadoPorId: GastoProgramadoByIdRespuesta | null;
    errorMessage: string;
    gastoRespuesta: GastoRespuesta | null;
}