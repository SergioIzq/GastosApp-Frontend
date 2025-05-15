import { createReducer, on } from "@ngrx/store";
import { TraspasoProgramadoDetailState } from "src/app/shared/models/entidades/estados/traspasoProgramadoDetailState.model";
import * as TraspasoProgramadoDetailActions from '../actions/traspaso-programado-detail.actions'

export const estadoInicial: TraspasoProgramadoDetailState = { loading: false, traspasoProgramadoPorId: null, errorCarga: false, errorMessage: '', cuentas: null};
export const traspasoProgramadoDetailFeatureKey = 'traspasoProgramadoDetailState';

const traspasoProgramadoDetailReducer = createReducer(
    estadoInicial,
    on(TraspasoProgramadoDetailActions.GetTraspasoProgramado, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(TraspasoProgramadoDetailActions.GetTraspasoProgramadoSuccess, (state, { traspasoProgramado }) => ({
        ...state,
        loading: false,
        traspasoProgramadoPorId: traspasoProgramado,
        errorCarga: false,
        createdSuccess: false
    })),
    on(TraspasoProgramadoDetailActions.GetTraspasoProgramadoFail, (state) => ({
        ...state,
        loading: false,
        traspasoProgramadoPorId: null,
        errorCarga: true,
        createdSuccess: false
    })),
    on(TraspasoProgramadoDetailActions.CreateTraspasoProgramado, (state) => ({
        ...state,
        loading: true,
        createdSuccess: false
    })),
    on(TraspasoProgramadoDetailActions.CreateTraspasoProgramadoSuccess, (state, { traspasoProgramado }) => ({
        ...state,
        loading: false,
        createdSuccess: true,        
    })),
    on(TraspasoProgramadoDetailActions.CreateTraspasoProgramadoFailure, (state) => ({
        ...state,
        loading: false,
        createdSuccess: false
    })),
    on(TraspasoProgramadoDetailActions.UpdateTraspasoProgramado, (state) => ({
        ...state,
        loading: true,
    })),
    on(TraspasoProgramadoDetailActions.UpdateTraspasoProgramadoSuccess, (state) => ({
        ...state,
        loading: false,
        createdSuccess: false
    })),
    on(TraspasoProgramadoDetailActions.UpdateTraspasoProgramadoFailure, (state, action) => ({
        ...state,
        loading: false,
        createdSuccess: false,
        errorMessage: action.errorMessage
    })),

    on(TraspasoProgramadoDetailActions.GetNewTraspasoProgramado, (state) => ({
        ...state,
        loading: true,
    })),

    on(TraspasoProgramadoDetailActions.GetNewTraspasoProgramadoSuccess, (state, { payload }) => ({
        ...state,
        loading: false,
        traspasoRespuesta: payload
    })),

    on(TraspasoProgramadoDetailActions.GetNewTraspasoProgramadoFail, (state) => ({
        ...state,
        loading: false,
        errorCarga: true,
    })),
);

export function reducer(state: TraspasoProgramadoDetailState = estadoInicial, action: any): TraspasoProgramadoDetailState {
    return traspasoProgramadoDetailReducer(state, action);
}
