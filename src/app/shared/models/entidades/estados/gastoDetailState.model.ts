import { GastoByIdRespuesta } from "../respuestas/gastoByIdRespuesta.model";
import { GastoRespuesta } from "../respuestas/gastoRespuesta.model";

export interface GastoDetailState{
    loading: boolean;
    errorCarga: boolean;
    gastoPorId: GastoByIdRespuesta | null;
    errorMessage: string;
    gastoRespuesta: GastoRespuesta | null;
}