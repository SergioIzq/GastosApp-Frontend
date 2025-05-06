import { Cuenta } from "../cuenta.model";
import { TraspasoByIdRespuesta } from "../respuestas/traspasos/traspasoByIdRespuesta.model";

export interface TraspasoDetailState {
    loading: boolean;
    errorCarga: boolean;
    traspasoPorIdRespuesta: TraspasoByIdRespuesta | null;
    cuentas: Cuenta[] | null
}