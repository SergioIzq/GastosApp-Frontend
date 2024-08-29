import { ResponseData } from "../responseData.model";

export interface EntidadListState<T> {
  loading: boolean;
  lista: ResponseData<T>;
  errorCarga: boolean;
}
