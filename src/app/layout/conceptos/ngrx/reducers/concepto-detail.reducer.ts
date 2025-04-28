import { createReducer, on } from "@ngrx/store";
import { ConceptoDetailState } from "src/app/shared/models/entidades/estados/conceptoDetail.model";
import * as ConceptoDetailActions from '../actions/concepto-detail.actions'

export const estadoInicial: ConceptoDetailState = { loading: false, conceptoPorId: null, errorCarga: false, categorias: null };
export const conceptoDetailFeatureKey = 'conceptoDetailState';

const conceptoDetailReducer = createReducer(
    estadoInicial,
    on(ConceptoDetailActions.GetConcepto, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.GetConceptoSuccess, (state, { conceptoPorId }) => ({
        ...state,
        loading: false,
        conceptoPorId: conceptoPorId,
        errorCarga: false,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.GetConceptoFail, (state) => ({
        ...state,
        loading: false,
        conceptoPorId: null,
        errorCarga: true,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.GetCategorias, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.GetCategoriasFailure, (state) => ({
        ...state,
        loading: false,
        errorCarga: true,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.GetCategoriasSuccess, (state, { categorias }) => ({
        ...state,
        loading: false,
        categorias: categorias,
        errorCarga: false,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.CreateConcepto, (state) => ({
        ...state,
        loading: true,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.CreateConceptoSuccess, (state, { concepto }) => ({
        ...state,
        loading: false,
        createdSuccess: true,
        concepto: concepto
    })),
    on(ConceptoDetailActions.CreateConceptoFailure, (state) => ({
        ...state,
        loading: false,
        concepto: null,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.UpdateConcepto, (state) => ({
        ...state,
        loading: true,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.UpdateConceptoSuccess, (state) => ({
        ...state,
        loading: false,
        createdSuccess: false
    })),
    on(ConceptoDetailActions.UpdateConceptoFailure, (state, action) => ({
        ...state,
        loading: false,
        createdSuccess: false
    }))
);

export function reducer(state: ConceptoDetailState = estadoInicial, action: any): ConceptoDetailState {
    return conceptoDetailReducer(state, action);
}
