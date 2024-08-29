import { createReducer, on } from "@ngrx/store";
import * as ResumenListActions from '../actions/resumen-list.actions'
import { ResumenListState } from "src/app/shared/models/entidades/estados/resumenListState.model";

export const estadoInicial: ResumenListState = {
    loading: false,   
    errorCarga: false,
    listaGastos: null,
    listaIngresos: null
};

export const resumenListReducer = createReducer(
    estadoInicial,
    on(ResumenListActions.LoadGastos, (state) => {
        return {
            ...state,
            loading: true,
        }
    }),
    on(ResumenListActions.LoadGastosSuccess, (state, { payload }) => {
        return {
            ...state,
            loading: false,
            listaGastos: payload
        };
    }),
    on(ResumenListActions.LoadGastosFailure, (state) => {
        return {
            ...state,
            loading: false,
            errorCarga: true
        };
    }),
    on(ResumenListActions.LoadIngresos, (state) => {
        return {
            ...state,
            loading: true,
        }
    }),
    on(ResumenListActions.LoadIngresosSuccess, (state, { payload }) => {
        return {
            ...state,
            loading: false,
            listaIngresos: payload
        };
    }),
    on(ResumenListActions.LoadIngresosFailure, (state) => {
        return {
            ...state,
            loading: false,
            errorCarga: true
        };
    }),
)