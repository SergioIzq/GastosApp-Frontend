import { createReducer, on } from "@ngrx/store";
import { GastoDetailState } from "src/app/shared/models/entidades/estados/gastoDetailState.model";
import * as GastoDetailActions from '../actions/gasto-detail.actions'

export const estadoInicial: GastoDetailState = { loading: false, gastoPorId: null, errorCarga: false, errorMessage: '', gastoRespuesta: null};
export const gastoDetailFeatureKey = 'gastoDetailState';

const gastoDetailReducer = createReducer(
    estadoInicial,
    on(GastoDetailActions.GetGasto, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(GastoDetailActions.GetGastoSuccess, (state, { gasto }) => ({
        ...state,
        loading: false,
        gastoPorId: gasto,
        errorCarga: false,
        createdSuccess: false
    })),
    on(GastoDetailActions.GetGastoFail, (state) => ({
        ...state,
        loading: false,
        gastoPorId: null,
        errorCarga: true,
        createdSuccess: false
    })),
    on(GastoDetailActions.CreateGasto, (state) => ({
        ...state,
        loading: true,
        createdSuccess: false
    })),
    on(GastoDetailActions.CreateGastoSuccess, (state, { gasto }) => ({
        ...state,
        loading: false,
        createdSuccess: true,        
    })),
    on(GastoDetailActions.CreateGastoFailure, (state) => ({
        ...state,
        loading: false,
        createdSuccess: false
    })),
    on(GastoDetailActions.UpdateGasto, (state) => ({
        ...state,
        loading: true,
    })),
    on(GastoDetailActions.UpdateGastoSuccess, (state) => ({
        ...state,
        loading: false,
        createdSuccess: false
    })),
    on(GastoDetailActions.UpdateGastoFailure, (state, action) => ({
        ...state,
        loading: false,
        createdSuccess: false,
        errorMessage: action.errorMessage
    })),

    on(GastoDetailActions.GetNewGasto, (state) => ({
        ...state,
        loading: true,
    })),

    on(GastoDetailActions.GetNewGastoSuccess, (state, { payload }) => ({
        ...state,
        loading: false,
        gastoRespuesta: payload
    })),

    on(GastoDetailActions.GetNewGastoFail, (state) => ({
        ...state,
        loading: false,
        errorCarga: true,
    })),
);

export function reducer(state: GastoDetailState = estadoInicial, action: any): GastoDetailState {
    return gastoDetailReducer(state, action);
}
