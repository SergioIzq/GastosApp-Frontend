import { createReducer, on } from "@ngrx/store";
import { TraspasoDetailState } from "src/app/shared/models/entidades/estados/traspasoDetail.model";
import * as TraspasoDetailActions from '../actions/traspaso-detail.actions'

export const estadoInicial: TraspasoDetailState = { loading: false, errorCarga: false, cuentas: null, traspasoPorId: null };

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
        traspasoPorId: traspasoPorId,
        errorCarga: false,
    })),
    on(TraspasoDetailActions.GetTraspasoFailure, (state) => ({
        ...state,
        loading: false,
        traspasoPorId: null,
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
    on(TraspasoDetailActions.GetCuentas, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(TraspasoDetailActions.GetCuentasFailure, (state) => ({
        ...state,
        loading: false,
        errorCarga: true,
        createdSuccess: false
    })),
    on(TraspasoDetailActions.GetCuentasSuccess, (state, { cuentas }) => ({
        ...state,
        loading: false,
        errorCarga: false,
        createdSuccess: false,
        cuentas: cuentas,
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

export function TraspasoDetailReducer(state: TraspasoDetailState = estadoInicial, action: any): TraspasoDetailState {
    return traspasoDetailReducer(state, action);
}
