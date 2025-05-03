import { createReducer, on } from "@ngrx/store";
import * as GastosProgramadosListActions from '../actions/gastos-programados-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { GastoProgramado } from "src/app/shared/models/entidades/gastoProgramado.model";

export const estadoInicial: EntidadListState<GastoProgramado> = { loading: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };
export const gastosProgramadosListFeatureKey = 'gastosProgramadosListState';

export const gastosProgramadosListReducer = createReducer(
    estadoInicial,
    on(GastosProgramadosListActions.LoadingGastosProgramados, (state) => {
        return {
            ...state,
            loading: true,
        }
    }),
    on(GastosProgramadosListActions.LoadingGastosProgramadosSuccess, (state, { listaGastosProgramados }) => {
        return {
            ...state,
            loading: false,
            lista: listaGastosProgramados
        };
    }),
    on(GastosProgramadosListActions.LoadingGastosProgramadosFailure, (state) => {
        return {
            ...state,
            loading: false,
            errorCarga: true
        };
    }),
    on(GastosProgramadosListActions.DeleteGastoProgramadoSuccess, (state) => {
        return {
            ...state,
            loading: false,
        };
    }),
    on(GastosProgramadosListActions.DeleteGastoProgramadoFailure, (state, action) => {
        return {
            ...state,
            loading: false,
            errorMessage: action.errorMessage
        };
    }),
)

export function reducer(state: EntidadListState<GastoProgramado> = estadoInicial, action: any): EntidadListState<GastoProgramado> {
    return gastosProgramadosListReducer(state, action);
}