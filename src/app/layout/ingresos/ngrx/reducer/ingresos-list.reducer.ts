import { createReducer, on } from "@ngrx/store";
import * as IngresosListActions from '../actions/ingresos-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Ingreso } from "src/app/shared/models/entidades/ingreso.model";

export const estadoInicial: EntidadListState<Ingreso> = { cargando: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };

export const ingresosListReducer = createReducer(
    estadoInicial,
    on(IngresosListActions.LoadingIngresos, (state) => {
        return {
            ...state,
            cargando: true,
        }
    }),
    on(IngresosListActions.LoadingIngresosSuccess, (state, { listaIngresos }) => {
        return {
            ...state,
            cargando: false,
            lista: listaIngresos
        };
    }),
    on(IngresosListActions.LoadingIngresosFailure, (state) => {
        return {
            ...state,
            cargando: false,
            errorCarga: true
        };
    }),
    on(IngresosListActions.DeleteIngresoSuccess, (state) => {
        return {
            ...state,
            cargando: false,
        };
    }),
    on(IngresosListActions.DeleteIngresoFailure, (state, action) => {
        return {
            ...state,
            cargando: false,
            errorMessage: action.errorMessage
        };
    }),
)