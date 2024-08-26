import { ResponseData } from "../responseData.model";

export interface EntidadListState<T> {
  cargando: boolean;
  lista: ResponseData<T>;
  errorCarga: boolean;
}
