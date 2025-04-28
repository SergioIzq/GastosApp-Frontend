import { createReducer, on } from "@ngrx/store";
import * as ConceptosListActions from '../actions/conceptos-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Concepto } from "src/app/shared/models/entidades/concepto.model";

export const estadoInicial: EntidadListState<Concepto> = { loading: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };
export const conceptosListFeatureKey = 'conceptosListState';

export const conceptosListReducer = createReducer(
    estadoInicial,
    on(ConceptosListActions.LoadingConceptos, (state) => {
        return {
            ...state,
            loading: true,
        }
    }),
    on(ConceptosListActions.LoadingConceptosSuccess, (state, { listaConceptos }) => {
        return {
            ...state,
            loading: false,
            lista: listaConceptos
        };
    }),
    on(ConceptosListActions.LoadingConceptosFailure, (state) => {
        return {
            ...state,
            loading: false,
            errorCarga: true,
            lista: { TotalRecords: 0, Items: [] }
        };
    }),
    on(ConceptosListActions.DeleteConceptoSuccess, (state) => {
        return {
            ...state,
            loading: false,        
            errorCarga: true    
        };
    }),
    on(ConceptosListActions.DeleteConceptoFailure, (state, action) => {
        return {
            ...state,
            loading: false,            
            errorMessage: action.errorMessage,
        };
    }),
)

export function reducer(state: EntidadListState<Concepto> = estadoInicial, action: any): EntidadListState<Concepto> {
    return conceptosListReducer(state, action);
}