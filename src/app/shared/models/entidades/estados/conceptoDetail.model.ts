import { Concepto } from "../concepto.model";
import { ResponseOne } from "../responseOne.model";
import { Categoria } from "../categoria.model";
import { ResponseData } from "../responseData.model";

export interface ConceptoDetailState{
    loading: boolean;
    errorCarga: boolean;
    conceptoPorId: Concepto | null;
    categorias: ResponseData<Categoria> | null;
}