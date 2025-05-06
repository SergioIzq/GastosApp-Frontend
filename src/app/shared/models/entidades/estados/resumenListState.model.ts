import { ResumenGastosResponse } from "../respuestas/resumen/ResumenGastosResumen.model";
import { ResumenIngresosResponse } from "../respuestas/resumen/resumenIngresosResponse.model";

export interface ResumenListState {
  loading: boolean;
  listaGastos: ResumenGastosResponse | null;
  listaIngresos: ResumenIngresosResponse | null;
  errorCarga: boolean;
}
