import { createReducer, on } from "@ngrx/store";
import { IngresoDetailState } from "src/app/shared/models/entidades/estados/ingresoDetailState.model";
import * as IngresoDetailActions from '../actions/ingreso-detail.actions'

export const estadoInicial: IngresoDetailState = { loading: false, ingresoPorId: null, errorCarga: false, errorMessage: '', ingresoRespuesta: null };

const ingresoDetailReducer = createReducer(
    estadoInicial,
    on(IngresoDetailActions.GetIngreso, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
    })),
    on(IngresoDetailActions.GetIngresoSuccess, (state, { ingreso }) => ({
        ...state,
        loading: false,
        ingresoPorId: ingreso,
        errorCarga: false,
    })),
    on(IngresoDetailActions.GetIngresoFail, (state) => ({
        ...state,
        loading: false,
        ingresoPorId: null,
        errorCarga: true,
    })),
    on(IngresoDetailActions.CreateIngreso, (state) => ({
        ...state,
        loading: true,
    })),
    on(IngresoDetailActions.CreateIngresoSuccess, (state, { ingreso }) => ({
        ...state,
        loading: false,
        ingreso: ingreso
    })),
    on(IngresoDetailActions.CreateIngresoFailure, (state) => ({
        ...state,
        loading: false,
    })),
    on(IngresoDetailActions.UpdateIngreso, (state) => ({
        ...state,
        loading: true,
    })),
    on(IngresoDetailActions.UpdateIngresoSuccess, (state) => ({
        ...state,
        loading: false,
    })),
    on(IngresoDetailActions.UpdateIngresoFailure, (state, action) => ({
        ...state,
        loading: false,
        errorMessage: action.errorMessage
    })),

    on(IngresoDetailActions.GetNewIngreso, (state) => ({
        ...state,
        loading: true,
    })),

    on(IngresoDetailActions.GetNewIngresoSuccess, (state, { payload }) => ({
        ...state,
        loading: false,
        ingresoRespuesta: payload
    })),

    on(IngresoDetailActions.GetNewIngresoFail, (state) => ({
        ...state,
        loading: false,
        errorCarga: true,
    })),
);

export function IngresoDetailReducer(state: IngresoDetailState = estadoInicial, action: any): IngresoDetailState {
    return ingresoDetailReducer(state, action);
}
