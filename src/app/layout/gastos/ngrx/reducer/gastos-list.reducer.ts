import { createReducer, on } from "@ngrx/store";
import * as GastosListActions from '../actions/gastos-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Gasto } from "src/app/shared/models/entidades/gasto.model";

export const estadoInicial: EntidadListState<Gasto> = { cargando: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };

export const gastosListReducer = createReducer(
    estadoInicial,
    on(GastosListActions.LoadingGastos, (state) => {
        return {
            ...state,
            cargando: true,
        }
    }),
    on(GastosListActions.LoadingGastosSuccess, (state, { listaGastos }) => {
        return {
            ...state,
            cargando: false,
            lista: listaGastos
        };
    }),
    on(GastosListActions.LoadingGastosFailure, (state) => {
        return {
            ...state,
            cargando: false,
            errorCarga: true
        };
    }),
    on(GastosListActions.DeleteGastoSuccess, (state) => {
        return {
            ...state,
            cargando: false,
        };
    }),
    on(GastosListActions.DeleteGastoFailure, (state, action) => {
        return {
            ...state,
            cargando: false,
            errorMessage: action.errorMessage
        };
    }),
)