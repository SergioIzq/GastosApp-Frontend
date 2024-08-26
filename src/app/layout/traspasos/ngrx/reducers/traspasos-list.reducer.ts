import { createReducer, on } from "@ngrx/store";
import * as TraspasosListActions from '../actions/traspasos-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Traspaso } from "src/app/shared/models/entidades/traspaso.model";

export const estadoInicial: EntidadListState<Traspaso> = { cargando: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };

export const traspasosListReducer = createReducer(
    estadoInicial,
    on(TraspasosListActions.LoadingTraspasos, (state) => {
        return {
            ...state,
            cargando: true,
        }
    }),
    on(TraspasosListActions.LoadingTraspasosSuccess, (state, { listaTraspasos }) => {
        return {
            ...state,
            cargando: false,
            lista: listaTraspasos
        };
    }),
    on(TraspasosListActions.LoadingTraspasosFailure, (state) => {
        return {
            ...state,
            cargando: false,
            errorCarga: true,
            lista: { TotalRecords: 0, Items: [] }
        };
    }),
    on(TraspasosListActions.DeleteTraspasoSuccess, (state) => {
        return {
            ...state,
            cargando: false,        
            errorCarga: true    
        };
    }),
    on(TraspasosListActions.DeleteTraspasoFailure, (state, action) => {
        return {
            ...state,
            cargando: false,            
            errorMessage: action.errorMessage,
        };
    }),
)