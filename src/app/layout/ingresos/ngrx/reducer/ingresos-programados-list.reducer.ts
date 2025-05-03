import { createReducer, on } from "@ngrx/store";
import * as IngresosProgramadosListActions from '../actions/ingresos-programados-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { IngresoProgramado } from "src/app/shared/models/entidades/ingresoProgramado.model";

export const estadoInicial: EntidadListState<IngresoProgramado> = { loading: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };
export const ingresosProgramadosListFeatureKey = 'ingresosProgramadosListState';

export const ingresosProgramadosListReducer = createReducer(
    estadoInicial,
    on(IngresosProgramadosListActions.LoadingIngresosProgramados, (state) => {
        return {
            ...state,
            loading: true,
        }
    }),
    on(IngresosProgramadosListActions.LoadingIngresosProgramadosSuccess, (state, { listaIngresosProgramados }) => {
        return {
            ...state,
            loading: false,
            lista: listaIngresosProgramados
        };
    }),
    on(IngresosProgramadosListActions.LoadingIngresosProgramadosFailure, (state) => {
        return {
            ...state,
            loading: false,
            errorCarga: true
        };
    }),
    on(IngresosProgramadosListActions.DeleteIngresoProgramadoSuccess, (state) => {
        return {
            ...state,
            loading: false,
        };
    }),
    on(IngresosProgramadosListActions.DeleteIngresoProgramadoFailure, (state, action) => {
        return {
            ...state,
            loading: false,
            errorMessage: action.errorMessage
        };
    }),
)

export function reducer(state: EntidadListState<IngresoProgramado> = estadoInicial, action: any): EntidadListState<IngresoProgramado> {
    return ingresosProgramadosListReducer(state, action);
}