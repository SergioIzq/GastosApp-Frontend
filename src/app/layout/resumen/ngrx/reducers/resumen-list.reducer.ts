import { createReducer, on } from "@ngrx/store";
import * as ResumenListActions from '../actions/resumen-list.actions'
import { ResumenListState } from "src/app/shared/models/entidades/estados/resumenListState.model";

export const estadoInicial: ResumenListState = {
    cargando: false,   
    errorCarga: false,
    listaGastos: null,
    listaIngresos: null
};

export const resumenListReducer = createReducer(
    estadoInicial,
    on(ResumenListActions.LoadGastos, (state) => {
        return {
            ...state,
            cargando: true,
        }
    }),
    on(ResumenListActions.LoadGastosSuccess, (state, { payload }) => {
        return {
            ...state,
            cargando: false,
            listaGastos: payload
        };
    }),
    on(ResumenListActions.LoadGastosFailure, (state) => {
        return {
            ...state,
            cargando: false,
            errorCarga: true
        };
    }),
    on(ResumenListActions.LoadIngresos, (state) => {
        return {
            ...state,
            cargando: true,
        }
    }),
    on(ResumenListActions.LoadIngresosSuccess, (state, { payload }) => {
        return {
            ...state,
            cargando: false,
            listaIngresos: payload
        };
    }),
    on(ResumenListActions.LoadIngresosFailure, (state) => {
        return {
            ...state,
            cargando: false,
            errorCarga: true
        };
    }),
)