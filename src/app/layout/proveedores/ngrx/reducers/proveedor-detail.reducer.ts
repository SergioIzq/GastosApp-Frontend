import { createReducer, on } from "@ngrx/store";
import { ProveedorDetailState } from "src/app/shared/models/entidades/estados/proveedorDetailState.model";
import * as ProveedorDetailActions from '../actions/proveedor-detail.actions'

export const estadoInicial: ProveedorDetailState = { loading: false, proveedorPorId: null, errorCarga: false };
export const proveedorFeatureKey = 'proveedorDetailState';

const proveedorDetailReducer = createReducer(
    estadoInicial,
    on(ProveedorDetailActions.GetProveedor, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
    })),
    on(ProveedorDetailActions.GetProveedorSuccess, (state, { proveedorPorId }) => ({
        ...state,
        loading: false,
        proveedorPorId: proveedorPorId,
        errorCarga: false,
    })),
    on(ProveedorDetailActions.GetProveedorFail, (state) => ({
        ...state,
        loading: false,
        proveedorPorId: null,
        errorCarga: true,
    })),

    on(ProveedorDetailActions.CreateProveedor, (state) => ({
        ...state,
        loading: true,
    })),
    on(ProveedorDetailActions.CreateProveedorSuccess, (state, { proveedor }) => ({
        ...state,
        loading: false,
        proveedor: proveedor
    })),
    on(ProveedorDetailActions.CreateProveedorFailure, (state) => ({
        ...state,
        loading: false,
        proveedor: null,
    })),
    on(ProveedorDetailActions.UpdateProveedor, (state) => ({
        ...state,
        loading: true,
    })),
    on(ProveedorDetailActions.UpdateProveedorSuccess, (state) => ({
        ...state,
        loading: false,
    })),
    on(ProveedorDetailActions.UpdateProveedorFailure, (state, action) => ({
        ...state,
        loading: false,
    }))
);

export function reducer(state: ProveedorDetailState = estadoInicial, action: any): ProveedorDetailState {
    return proveedorDetailReducer(state, action);
}
