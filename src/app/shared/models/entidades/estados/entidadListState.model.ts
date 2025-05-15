import { ResponseData } from "../respuestas/respuestas-genericas/responseData.model";

export interface EntidadListState<T> {
  loading: boolean;
  lista: ResponseData<T>;
  errorCarga: boolean;
}
