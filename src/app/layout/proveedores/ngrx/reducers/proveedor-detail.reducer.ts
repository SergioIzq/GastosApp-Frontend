import { createReducer, on } from "@ngrx/store";
import { ProveedorDetailState } from "src/app/shared/models/entidades/estados/proveedorDetailState.model";
import * as ProveedorDetailActions from '../actions/proveedor-detail.actions'

export const estadoInicial: ProveedorDetailState = { cargando: false, proveedorPorId: null, errorCarga: false };

const proveedorDetailReducer = createReducer(
    estadoInicial,
    on(ProveedorDetailActions.GetProveedor, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(ProveedorDetailActions.GetProveedorSuccess, (state, { proveedorPorId }) => ({
        ...state,
        cargando: false,
        proveedorPorId: proveedorPorId,
        errorCarga: false,
        createdSuccess: false
    })),
    on(ProveedorDetailActions.GetProveedorFail, (state) => ({
        ...state,
        cargando: false,
        proveedorPorId: null,
        errorCarga: true,
        createdSuccess: false
    })),

    on(ProveedorDetailActions.CreateProveedor, (state) => ({
        ...state,
        cargando: true,
        createdSuccess: false
    })),
    on(ProveedorDetailActions.CreateProveedorSuccess, (state, { proveedor }) => ({
        ...state,
        cargando: false,
        createdSuccess: true,
        proveedor: proveedor
    })),
    on(ProveedorDetailActions.CreateProveedorFailure, (state) => ({
        ...state,
        cargando: false,
        proveedor: null,
        createdSuccess: false
    })),
    on(ProveedorDetailActions.UpdateProveedor, (state) => ({
        ...state,
        cargando: true,
        createdSuccess: false
    })),
    on(ProveedorDetailActions.UpdateProveedorSuccess, (state) => ({
        ...state,
        cargando: false,
        createdSuccess: false
    })),
    on(ProveedorDetailActions.UpdateProveedorFailure, (state, action) => ({
        ...state,
        cargando: false,
        createdSuccess: false
    }))
);

export function ProveedorDetailReducer(state: ProveedorDetailState = estadoInicial, action: any): ProveedorDetailState {
    return proveedorDetailReducer(state, action);
}
