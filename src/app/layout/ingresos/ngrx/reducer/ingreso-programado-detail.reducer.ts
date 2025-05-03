import { createReducer, on } from "@ngrx/store";
import { IngresoProgramadoDetailState } from "src/app/shared/models/entidades/estados/ingresoProgramadoDetailState.model";
import * as IngresoProgramadoDetailActions from '../actions/ingreso-programado-detail.actions'

export const estadoInicial: IngresoProgramadoDetailState = { loading: false, ingresoProgramadoPorId: null, errorCarga: false, errorMessage: '', ingresoRespuesta: null};
export const ingresoProgramadoDetailFeatureKey = 'ingresoProgramadoDetailState';

const ingresoProgramadoDetailReducer = createReducer(
    estadoInicial,
    on(IngresoProgramadoDetailActions.GetIngresoProgramado, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(IngresoProgramadoDetailActions.GetIngresoProgramadoSuccess, (state, { ingresoProgramado }) => ({
        ...state,
        loading: false,
        ingresoProgramadoPorId: ingresoProgramado,
        errorCarga: false,
        createdSuccess: false
    })),
    on(IngresoProgramadoDetailActions.GetIngresoProgramadoFail, (state) => ({
        ...state,
        loading: false,
        ingresoProgramadoPorId: null,
        errorCarga: true,
        createdSuccess: false
    })),
    on(IngresoProgramadoDetailActions.CreateIngresoProgramado, (state) => ({
        ...state,
        loading: true,
        createdSuccess: false
    })),
    on(IngresoProgramadoDetailActions.CreateIngresoProgramadoSuccess, (state, { ingresoProgramado }) => ({
        ...state,
        loading: false,
        createdSuccess: true,        
    })),
    on(IngresoProgramadoDetailActions.CreateIngresoProgramadoFailure, (state) => ({
        ...state,
        loading: false,
        createdSuccess: false
    })),
    on(IngresoProgramadoDetailActions.UpdateIngresoProgramado, (state) => ({
        ...state,
        loading: true,
    })),
    on(IngresoProgramadoDetailActions.UpdateIngresoProgramadoSuccess, (state) => ({
        ...state,
        loading: false,
        createdSuccess: false
    })),
    on(IngresoProgramadoDetailActions.UpdateIngresoProgramadoFailure, (state, action) => ({
        ...state,
        loading: false,
        createdSuccess: false,
        errorMessage: action.errorMessage
    })),

    on(IngresoProgramadoDetailActions.GetNewIngresoProgramado, (state) => ({
        ...state,
        loading: true,
    })),

    on(IngresoProgramadoDetailActions.GetNewIngresoProgramadoSuccess, (state, { payload }) => ({
        ...state,
        loading: false,
        ingresoRespuesta: payload
    })),

    on(IngresoProgramadoDetailActions.GetNewIngresoProgramadoFail, (state) => ({
        ...state,
        loading: false,
        errorCarga: true,
    })),
);

export function reducer(state: IngresoProgramadoDetailState = estadoInicial, action: any): IngresoProgramadoDetailState {
    return ingresoProgramadoDetailReducer(state, action);
}
