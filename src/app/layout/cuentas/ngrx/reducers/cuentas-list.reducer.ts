import { createReducer, on } from "@ngrx/store";
import * as CuentasListActions from '../actions/cuentas-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Cuenta } from "src/app/shared/models/entidades/cuenta.model";

export const estadoInicial: EntidadListState<Cuenta> = { loading: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };
export const cuentasListFeatureKey = 'cuentasListState';

export const cuentasListReducer = createReducer(
    estadoInicial,
    on(CuentasListActions.LoadingCuentas, (state) => {
        return {
            ...state,
            loading: true,
        }
    }),
    on(CuentasListActions.LoadingCuentasSuccess, (state, { listaCuentas }) => {
        return {
            ...state,
            loading: false,
            lista: listaCuentas
        };
    }),
    on(CuentasListActions.LoadingCuentasFailure, (state) => {
        return {
            ...state,
            loading: false,
            errorCarga: true,
            lista: { TotalRecords: 0, Items: [] }
        };
    }),
    on(CuentasListActions.DeleteCuentaSuccess, (state) => {
        return {
            ...state,
            loading: false,        
            errorCarga: true    
        };
    }),
    on(CuentasListActions.DeleteCuentaFailure, (state, action) => {
        return {
            ...state,
            loading: false,            
            errorMessage: action.errorMessage,
        };
    }),
)

export function reducer(state: EntidadListState<Cuenta> = estadoInicial, action: any): EntidadListState<Cuenta> {
    return cuentasListReducer(state, action);
}