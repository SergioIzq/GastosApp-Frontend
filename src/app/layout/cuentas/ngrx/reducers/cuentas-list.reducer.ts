import { createReducer, on } from "@ngrx/store";
import * as CuentasListActions from '../actions/cuentas-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Cuenta } from "src/app/shared/models/entidades/cuenta.model";

export const estadoInicial: EntidadListState<Cuenta> = { cargando: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };

export const cuentasListReducer = createReducer(
    estadoInicial,
    on(CuentasListActions.LoadingCuentas, (state) => {
        return {
            ...state,
            cargando: true,
        }
    }),
    on(CuentasListActions.LoadingCuentasSuccess, (state, { listaCuentas }) => {
        return {
            ...state,
            cargando: false,
            lista: listaCuentas
        };
    }),
    on(CuentasListActions.LoadingCuentasFailure, (state) => {
        return {
            ...state,
            cargando: false,
            errorCarga: true,
            lista: { TotalRecords: 0, Items: [] }
        };
    }),
    on(CuentasListActions.DeleteCuentaSuccess, (state) => {
        return {
            ...state,
            cargando: false,        
            errorCarga: true    
        };
    }),
    on(CuentasListActions.DeleteCuentaFailure, (state, action) => {
        return {
            ...state,
            cargando: false,            
            errorMessage: action.errorMessage,
        };
    }),
)