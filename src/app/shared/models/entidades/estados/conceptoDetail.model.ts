import { Concepto } from "../concepto.model";
import { ResponseOne } from "../respuestas/responseOne.model";
import { Categoria } from "../categoria.model";
import { ResponseData } from "../respuestas/responseData.model";

export interface ConceptoDetailState{
    loading: boolean;
    errorCarga: boolean;
    conceptoPorId: Concepto | null;
    categorias: ResponseData<Categoria> | null;
}