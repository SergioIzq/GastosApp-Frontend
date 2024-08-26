import { createReducer, on } from "@ngrx/store";
import { TraspasoDetailState } from "src/app/shared/models/entidades/estados/traspasoDetail.model";
import * as TraspasoDetailActions from '../actions/traspaso-detail.actions'

export const estadoInicial: TraspasoDetailState = { cargando: false, errorCarga: false, cuentas: null, traspasoPorId: null };

const traspasoDetailReducer = createReducer(
    estadoInicial,

    on(TraspasoDetailActions.GetTraspaso, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
    })),
    on(TraspasoDetailActions.GetTraspasoSuccess, (state, { traspasoPorId }) => ({
        ...state,
        cargando: false,
        traspasoPorId: traspasoPorId,
        errorCarga: false,
    })),
    on(TraspasoDetailActions.GetTraspasoFailure, (state) => ({
        ...state,
        cargando: false,
        traspasoPorId: null,
        errorCarga: true,
    })),
    on(TraspasoDetailActions.RealizarTraspaso, (state) => ({
        ...state,
        cargando: true,
    })),
    on(TraspasoDetailActions.RealizarTraspasoSuccess, (state, { traspaso }) => ({
        ...state,
        cargando: false,
        traspaso: traspaso
    })),
    on(TraspasoDetailActions.RealizarTraspasoFail, (state) => ({
        ...state,
        cargando: false,
    })),
    on(TraspasoDetailActions.GetCuentas, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(TraspasoDetailActions.GetCuentasFailure, (state) => ({
        ...state,
        cargando: false,
        errorCarga: true,
        createdSuccess: false
    })),
    on(TraspasoDetailActions.GetCuentasSuccess, (state, { cuentas }) => ({
        ...state,
        cargando: false,
        errorCarga: false,
        createdSuccess: false,
        cuentas: cuentas,
    })),
    on(TraspasoDetailActions.UpdateTraspaso, (state) => ({
        ...state,
        cargando: true,
    })),
    on(TraspasoDetailActions.UpdateTraspasoSuccess, (state) => ({
        ...state,
        cargando: false,
    })),
    on(TraspasoDetailActions.UpdateTraspasoFailure, (state, action) => ({
        ...state,
        cargando: false,
    }))
);

export function TraspasoDetailReducer(state: TraspasoDetailState = estadoInicial, action: any): TraspasoDetailState {
    return traspasoDetailReducer(state, action);
}
