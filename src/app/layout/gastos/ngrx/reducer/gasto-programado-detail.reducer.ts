import { createReducer, on } from "@ngrx/store";
import { GastoProgramadoDetailState } from "src/app/shared/models/entidades/estados/gastoProgramadoDetailState.model";
import * as GastoProgramadoDetailActions from '../actions/gasto-programado-detail.actions'

export const estadoInicial: GastoProgramadoDetailState = { loading: false, gastoProgramadoPorId: null, errorCarga: false, errorMessage: '', gastoRespuesta: null};
export const gastoProgramadoDetailFeatureKey = 'gastoProgramadoDetailState';

const gastoProgramadoDetailReducer = createReducer(
    estadoInicial,
    on(GastoProgramadoDetailActions.GetGastoProgramado, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(GastoProgramadoDetailActions.GetGastoProgramadoSuccess, (state, { gastoProgramado }) => ({
        ...state,
        loading: false,
        gastoPorId: gastoProgramado,
        errorCarga: false,
        createdSuccess: false
    })),
    on(GastoProgramadoDetailActions.GetGastoProgramadoFail, (state) => ({
        ...state,
        loading: false,
        gastoPorId: null,
        errorCarga: true,
        createdSuccess: false
    })),
    on(GastoProgramadoDetailActions.CreateGastoProgramado, (state) => ({
        ...state,
        loading: true,
        createdSuccess: false
    })),
    on(GastoProgramadoDetailActions.CreateGastoProgramadoSuccess, (state, { gastoProgramado }) => ({
        ...state,
        loading: false,
        createdSuccess: true,        
    })),
    on(GastoProgramadoDetailActions.CreateGastoProgramadoFailure, (state) => ({
        ...state,
        loading: false,
        createdSuccess: false
    })),
    on(GastoProgramadoDetailActions.UpdateGastoProgramado, (state) => ({
        ...state,
        loading: true,
    })),
    on(GastoProgramadoDetailActions.UpdateGastoProgramadoSuccess, (state) => ({
        ...state,
        loading: false,
        createdSuccess: false
    })),
    on(GastoProgramadoDetailActions.UpdateGastoProgramadoFailure, (state, action) => ({
        ...state,
        loading: false,
        createdSuccess: false,
        errorMessage: action.errorMessage
    })),

    on(GastoProgramadoDetailActions.GetNewGastoProgramado, (state) => ({
        ...state,
        loading: true,
    })),

    on(GastoProgramadoDetailActions.GetNewGastoProgramadoSuccess, (state, { payload }) => ({
        ...state,
        loading: false,
        gastoRespuesta: payload
    })),

    on(GastoProgramadoDetailActions.GetNewGastoProgramadoFail, (state) => ({
        ...state,
        loading: false,
        errorCarga: true,
    })),
);

export function reducer(state: GastoProgramadoDetailState = estadoInicial, action: any): GastoProgramadoDetailState {
    return gastoProgramadoDetailReducer(state, action);
}
