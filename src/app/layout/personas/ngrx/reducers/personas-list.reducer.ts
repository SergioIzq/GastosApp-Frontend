import { createReducer, on } from "@ngrx/store";
import * as PersonasListActions from '../actions/personas-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Persona } from "src/app/shared/models/entidades/persona.model";

export const estadoInicial: EntidadListState<Persona> = { loading: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };

export const personasListReducer = createReducer(
    estadoInicial,
    on(PersonasListActions.LoadingPersonas, (state) => {
        return {
            ...state,
            loading: true,
        }
    }),
    on(PersonasListActions.LoadingPersonasSuccess, (state, { listaPersonas }) => {
        return {
            ...state,
            loading: false,
            lista: listaPersonas
        };
    }),
    on(PersonasListActions.LoadingPersonasFailure, (state) => {
        return {
            ...state,
            loading: false,
            errorCarga: true,
            lista: { TotalRecords: 0, Items: [] }
        };
    }),
    on(PersonasListActions.DeletePersonaSuccess, (state) => {
        return {
            ...state,
            loading: false,        
            errorCarga: true    
        };
    }),
    on(PersonasListActions.DeletePersonaFailure, (state, action) => {
        return {
            ...state,
            loading: false,            
            errorMessage: action.errorMessage,
        };
    }),
)