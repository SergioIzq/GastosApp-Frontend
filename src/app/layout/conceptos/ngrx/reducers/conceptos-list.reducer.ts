import { createReducer, on } from "@ngrx/store";
import * as ConceptosListActions from '../actions/conceptos-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Concepto } from "src/app/shared/models/entidades/concepto.model";

export const estadoInicial: EntidadListState<Concepto> = { cargando: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };

export const conceptosListReducer = createReducer(
    estadoInicial,
    on(ConceptosListActions.LoadingConceptos, (state) => {
        return {
            ...state,
            cargando: true,
        }
    }),
    on(ConceptosListActions.LoadingConceptosSuccess, (state, { listaConceptos }) => {
        return {
            ...state,
            cargando: false,
            lista: listaConceptos
        };
    }),
    on(ConceptosListActions.LoadingConceptosFailure, (state) => {
        return {
            ...state,
            cargando: false,
            errorCarga: true,
            lista: { TotalRecords: 0, Items: [] }
        };
    }),
    on(ConceptosListActions.DeleteConceptoSuccess, (state) => {
        return {
            ...state,
            cargando: false,        
            errorCarga: true    
        };
    }),
    on(ConceptosListActions.DeleteConceptoFailure, (state, action) => {
        return {
            ...state,
            cargando: false,            
            errorMessage: action.errorMessage,
        };
    }),
)