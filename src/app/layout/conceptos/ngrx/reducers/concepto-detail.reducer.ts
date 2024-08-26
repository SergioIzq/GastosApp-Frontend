import { createReducer, on } from "@ngrx/store";
import { ConceptoDetailState } from "src/app/shared/models/entidades/estados/conceptoDetail.model";
import * as ConceptoDetailActions from '../actions/concepto-detail.actions'

export const estadoInicial: ConceptoDetailState = { cargando: false, conceptoPorId: null, errorCarga: false, categorias: null };

const conceptoDetailReducer = createReducer(
    estadoInicial,
    on(ConceptoDetailActions.GetConcepto, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.GetConceptoSuccess, (state, { conceptoPorId }) => ({
        ...state,
        cargando: false,
        conceptoPorId: conceptoPorId,
        errorCarga: false,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.GetConceptoFail, (state) => ({
        ...state,
        cargando: false,
        conceptoPorId: null,
        errorCarga: true,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.GetCategorias, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.GetCategoriasFailure, (state) => ({
        ...state,
        cargando: false,
        errorCarga: true,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.GetCategoriasSuccess, (state, { categorias }) => ({
        ...state,
        cargando: false,
        categorias: categorias,
        errorCarga: false,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.CreateConcepto, (state) => ({
        ...state,
        cargando: true,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.CreateConceptoSuccess, (state, { concepto }) => ({
        ...state,
        cargando: false,
        createdSuccess: true,
        concepto: concepto
    })),
    on(ConceptoDetailActions.CreateConceptoFailure, (state) => ({
        ...state,
        cargando: false,
        concepto: null,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.UpdateConcepto, (state) => ({
        ...state,
        cargando: true,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.UpdateConceptoSuccess, (state) => ({
        ...state,
        cargando: false,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.UpdateConceptoFailure, (state, action) => ({
        ...state,
        cargando: false,
        createdSuccess: false
    }))
);

export function ConceptoDetailReducer(state: ConceptoDetailState = estadoInicial, action: any): ConceptoDetailState {
    return conceptoDetailReducer(state, action);
}
