import { GastoByIdRespuesta } from "../respuestas/gastos/gastoByIdRespuesta.model";
import { GastoRespuesta } from "../respuestas/gastos/gastoRespuesta.model";

export interface GastoDetailState{
    loading: boolean;
    errorCarga: boolean;
    gastoPorId: GastoByIdRespuesta | null;
    errorMessage: string;
    gastoRespuesta: GastoRespuesta | null;
}