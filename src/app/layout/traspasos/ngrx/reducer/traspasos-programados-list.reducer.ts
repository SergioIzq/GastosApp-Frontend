import { createReducer, on } from "@ngrx/store";
import * as TraspasosProgramadosListActions from '../actions/traspasos-programados-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { TraspasoProgramado } from "src/app/shared/models/entidades/traspasoProgramado.model";

export const estadoInicial: EntidadListState<TraspasoProgramado> = { loading: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };
export const traspasosProgramadosListFeatureKey = 'traspasosProgramadosListState';

export const traspasosProgramadosListReducer = createReducer(
    estadoInicial,
    on(TraspasosProgramadosListActions.LoadingTraspasosProgramados, (state) => {
        return {
            ...state,
            loading: true,
        }
    }),
    on(TraspasosProgramadosListActions.LoadingTraspasosProgramadosSuccess, (state, { listaTraspasosProgramados }) => {
        return {
            ...state,
            loading: false,
            lista: listaTraspasosProgramados
        };
    }),
    on(TraspasosProgramadosListActions.LoadingTraspasosProgramadosFailure, (state) => {
        return {
            ...state,
            loading: false,
            errorCarga: true
        };
    }),
    on(TraspasosProgramadosListActions.DeleteTraspasoProgramadoSuccess, (state) => {
        return {
            ...state,
            loading: false,
        };
    }),
    on(TraspasosProgramadosListActions.DeleteTraspasoProgramadoFailure, (state, action) => {
        return {
            ...state,
            loading: false,
            errorMessage: action.errorMessage
        };
    }),
)

export function reducer(state: EntidadListState<TraspasoProgramado> = estadoInicial, action: any): EntidadListState<TraspasoProgramado> {
    return traspasosProgramadosListReducer(state, action);
}