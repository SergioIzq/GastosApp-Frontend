import { createReducer, on } from "@ngrx/store";
import * as PersonasListActions from '../actions/personas-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Persona } from "src/app/shared/models/entidades/persona.model";

export const estadoInicial: EntidadListState<Persona> = { cargando: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };

export const personasListReducer = createReducer(
    estadoInicial,
    on(PersonasListActions.LoadingPersonas, (state) => {
        return {
            ...state,
            cargando: true,
        }
    }),
    on(PersonasListActions.LoadingPersonasSuccess, (state, { listaPersonas }) => {
        return {
            ...state,
            cargando: false,
            lista: listaPersonas
        };
    }),
    on(PersonasListActions.LoadingPersonasFailure, (state) => {
        return {
            ...state,
            cargando: false,
            errorCarga: true,
            lista: { TotalRecords: 0, Items: [] }
        };
    }),
    on(PersonasListActions.DeletePersonaSuccess, (state) => {
        return {
            ...state,
            cargando: false,        
            errorCarga: true    
        };
    }),
    on(PersonasListActions.DeletePersonaFailure, (state, action) => {
        return {
            ...state,
            cargando: false,            
            errorMessage: action.errorMessage,
        };
    }),
)