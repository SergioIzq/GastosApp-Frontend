import { ResumenGastosResponse } from "../ResumenGastosResumen.model";
import { ResumenIngresosResponse } from "../resumenIngresosResponse.model";

export interface ResumenListState {
  loading: boolean;
  listaGastos: ResumenGastosResponse | null;
  listaIngresos: ResumenIngresosResponse | null;
  errorCarga: boolean;
}
