import { createReducer, on } from "@ngrx/store";
import * as IngresosListActions from '../actions/ingresos-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Ingreso } from "src/app/shared/models/entidades/ingreso.model";

export const estadoInicial: EntidadListState<Ingreso> = { loading: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };
export const ingresosListFeatureKey = 'ingresosListState';

export const ingresosListReducer = createReducer(
    estadoInicial,
    on(IngresosListActions.LoadingIngresos, (state) => {
        return {
            ...state,
            loading: true,
        }
    }),
    on(IngresosListActions.LoadingIngresosSuccess, (state, { listaIngresos }) => {
        return {
            ...state,
            loading: false,
            lista: listaIngresos
        };
    }),
    on(IngresosListActions.LoadingIngresosFailure, (state) => {
        return {
            ...state,
            loading: false,
            errorCarga: true
        };
    }),
    on(IngresosListActions.DeleteIngresoSuccess, (state) => {
        return {
            ...state,
            loading: false,
        };
    }),
    on(IngresosListActions.DeleteIngresoFailure, (state, action) => {
        return {
            ...state,
            loading: false,
            errorMessage: action.errorMessage
        };
    }),
)

export function reducer(state: EntidadListState<Ingreso> = estadoInicial, action: any): EntidadListState<Ingreso> {
    return ingresosListReducer(state, action);
}