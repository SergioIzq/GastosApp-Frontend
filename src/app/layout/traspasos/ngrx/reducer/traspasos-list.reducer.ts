import { createReducer, on } from "@ngrx/store";
import * as TraspasosListActions from '../actions/traspasos-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Traspaso } from "src/app/shared/models/entidades/traspaso.model";

export const estadoInicial: EntidadListState<Traspaso> = { loading: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };
export const traspasosListFeatureKey='traspasosListState';

export const traspasosListReducer = createReducer(
    estadoInicial,
    on(TraspasosListActions.LoadingTraspasos, (state) => {
        return {
            ...state,
            loading: true,
        }
    }),
    on(TraspasosListActions.LoadingTraspasosSuccess, (state, { listaTraspasos }) => {
        return {
            ...state,
            loading: false,
            lista: listaTraspasos
        };
    }),
    on(TraspasosListActions.LoadingTraspasosFailure, (state) => {
        return {
            ...state,
            loading: false,
            errorCarga: true,
            lista: { TotalRecords: 0, Items: [] }
        };
    }),
    on(TraspasosListActions.DeleteTraspasoSuccess, (state) => {
        return {
            ...state,
            loading: false,        
            errorCarga: true    
        };
    }),
    on(TraspasosListActions.DeleteTraspasoFailure, (state, action) => {
        return {
            ...state,
            loading: false,            
            errorMessage: action.errorMessage,
        };
    }),
)

export function reducer(state: EntidadListState<Traspaso> = estadoInicial, action: any): EntidadListState<Traspaso> {
    return traspasosListReducer(state, action);
}