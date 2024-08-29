import { createReducer, on } from "@ngrx/store";
import * as GastosListActions from '../actions/gastos-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Gasto } from "src/app/shared/models/entidades/gasto.model";

export const estadoInicial: EntidadListState<Gasto> = { loading: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };

export const gastosListReducer = createReducer(
    estadoInicial,
    on(GastosListActions.LoadingGastos, (state) => {
        return {
            ...state,
            loading: true,
        }
    }),
    on(GastosListActions.LoadingGastosSuccess, (state, { listaGastos }) => {
        return {
            ...state,
            loading: false,
            lista: listaGastos
        };
    }),
    on(GastosListActions.LoadingGastosFailure, (state) => {
        return {
            ...state,
            loading: false,
            errorCarga: true
        };
    }),
    on(GastosListActions.DeleteGastoSuccess, (state) => {
        return {
            ...state,
            loading: false,
        };
    }),
    on(GastosListActions.DeleteGastoFailure, (state, action) => {
        return {
            ...state,
            loading: false,
            errorMessage: action.errorMessage
        };
    }),
)