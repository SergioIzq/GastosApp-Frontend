import { createReducer, on } from "@ngrx/store";
import { CuentaDetailState } from "src/app/shared/models/entidades/estados/cuentaDetailState.model";
import * as CuentaDetailActions from '../actions/cuenta-detail.actions'

export const estadoInicial: CuentaDetailState = { loading: false, cuentaPorId: null, errorCarga: false };

const cuentaDetailReducer = createReducer(
    estadoInicial,
    on(CuentaDetailActions.GetCuenta, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(CuentaDetailActions.GetCuentaSuccess, (state, { cuentaPorId }) => ({
        ...state,
        loading: false,
        cuentaPorId: cuentaPorId,
        errorCarga: false,
        createdSuccess: false
    })),
    on(CuentaDetailActions.GetCuentaFail, (state) => ({
        ...state,
        loading: false,
        cuentaPorId: null,
        errorCarga: true,
        createdSuccess: false
    })),

    on(CuentaDetailActions.CreateCuenta, (state) => ({
        ...state,
        loading: true,
        createdSuccess: false
    })),
    on(CuentaDetailActions.CreateCuentaSuccess, (state, { cuenta }) => ({
        ...state,
        loading: false,
        createdSuccess: true,
        cuenta: cuenta
    })),
    on(CuentaDetailActions.CreateCuentaFailure, (state) => ({
        ...state,
        loading: false,
        cuenta: null,
        createdSuccess: false
    })),
    on(CuentaDetailActions.UpdateCuenta, (state) => ({
        ...state,
        loading: true,
        createdSuccess: false
    })),
    on(CuentaDetailActions.UpdateCuentaSuccess, (state) => ({
        ...state,
        loading: false,
        createdSuccess: false
    })),
    on(CuentaDetailActions.UpdateCuentaFailure, (state, action) => ({
        ...state,
        loading: false,
        createdSuccess: false
    }))
);

export function CuentaDetailReducer(state: CuentaDetailState = estadoInicial, action: any): CuentaDetailState {
    return cuentaDetailReducer(state, action);
}
