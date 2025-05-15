import { Cuenta } from "../cuenta.model";
import { TraspasoProgramadoByIdRespuesta } from "../respuestas/traspasos/traspasoProgramadoByIdRespuesta.model";

export interface TraspasoProgramadoDetailState{
    loading: boolean;
    errorCarga: boolean;
    traspasoProgramadoPorId: TraspasoProgramadoByIdRespuesta | null;
    errorMessage: string;
    cuentas: Cuenta[] | null;
}