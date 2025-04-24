import { ResumenGastosResponse } from "../respuestas/ResumenGastosResumen.model";
import { ResumenIngresosResponse } from "../respuestas/resumenIngresosResponse.model";

export interface ResumenListState {
  loading: boolean;
  listaGastos: ResumenGastosResponse | null;
  listaIngresos: ResumenIngresosResponse | null;
  errorCarga: boolean;
}
