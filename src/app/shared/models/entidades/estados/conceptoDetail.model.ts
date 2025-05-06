import { Concepto } from "../concepto.model";
import { ResponseOne } from "../respuestas/respuestas-genericas/responseOne.model";
import { Categoria } from "../categoria.model";
import { ResponseData } from "../respuestas/respuestas-genericas/responseData.model";

export interface ConceptoDetailState{
    loading: boolean;
    errorCarga: boolean;
    conceptoPorId: Concepto | null;
    categorias: ResponseData<Categoria> | null;
}