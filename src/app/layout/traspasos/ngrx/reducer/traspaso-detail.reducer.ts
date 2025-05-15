import { createReducer, on } from "@ngrx/store";
import { TraspasoDetailState } from "src/app/shared/models/entidades/estados/traspasoDetail.model";
import * as TraspasoDetailActions from '../actions/traspaso-detail.actions'

export const estadoInicial: TraspasoDetailState = { loading: false, errorCarga: false, cuentas: null, traspasoPorIdRespuesta: null };
export const traspasoDetailFeatureKey = 'traspasoDetailState';

const traspasoDetailReducer = createReducer(
    estadoInicial,

    on(TraspasoDetailActions.GetTraspaso, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
    })),
    on(TraspasoDetailActions.GetTraspasoSuccess, (state, { traspasoPorId }) => ({
        ...state,
        loading: false,
        traspasoPorIdRespuesta: traspasoPorId,
        errorCarga: false,
    })),
    on(TraspasoDetailActions.GetTraspasoFailure, (state) => ({
        ...state,
        loading: false,
        traspasoPorIdRespuesta: null,
        errorCarga: true,
    })),
    on(TraspasoDetailActions.GetNewTraspaso, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
    })),
    on(TraspasoDetailActions.GetNewTraspasoSuccess, (state, { payload }) => ({
        ...state,
        loading: false,
        cuentas: payload,
        errorCarga: false,
    })),
    on(TraspasoDetailActions.GetNewTraspasoFail, (state) => ({
        ...state,
        loading: false,
        cuentas: null,
        errorCarga: true,
    })),
    on(TraspasoDetailActions.RealizarTraspaso, (state) => ({
        ...state,
        loading: true,
    })),
    on(TraspasoDetailActions.RealizarTraspasoSuccess, (state, { traspaso }) => ({
        ...state,
        loading: false,
        traspaso: traspaso
    })),
    on(TraspasoDetailActions.RealizarTraspasoFail, (state) => ({
        ...state,
        loading: false,
    })),
    on(TraspasoDetailActions.UpdateTraspaso, (state) => ({
        ...state,
        loading: true,
    })),
    on(TraspasoDetailActions.UpdateTraspasoSuccess, (state) => ({
        ...state,
        loading: false,
    })),
    on(TraspasoDetailActions.UpdateTraspasoFailure, (state, action) => ({
        ...state,
        loading: false,
    }))
);

export function reducer(state: TraspasoDetailState = estadoInicial, action: any): TraspasoDetailState {
    return traspasoDetailReducer(state, action);
}
