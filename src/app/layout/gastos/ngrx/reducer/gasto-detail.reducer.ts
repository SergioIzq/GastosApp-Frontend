import { createReducer, on } from "@ngrx/store";
import { GastoDetailState } from "src/app/shared/models/entidades/estados/gastoDetailState.model";
import * as GastoDetailActions from '../actions/gasto-detail.actions'

export const estadoInicial: GastoDetailState = { cargando: false, gastoPorId: null, errorCarga: false, errorMessage: '', personas: null, cuentas: null, formasPago: null, conceptos: null, proveedores: null };

const gastoDetailReducer = createReducer(
    estadoInicial,
    on(GastoDetailActions.GetGasto, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(GastoDetailActions.GetGastoSuccess, (state, { gasto }) => ({
        ...state,
        cargando: false,
        gastoPorId: gasto,
        errorCarga: false,
        createdSuccess: false
    })),
    on(GastoDetailActions.GetGastoFail, (state) => ({
        ...state,
        cargando: false,
        gastoPorId: null,
        errorCarga: true,
        createdSuccess: false
    })),
    on(GastoDetailActions.CreateGasto, (state) => ({
        ...state,
        cargando: true,
        createdSuccess: false
    })),
    on(GastoDetailActions.CreateGastoSuccess, (state, { gasto }) => ({
        ...state,
        cargando: false,
        createdSuccess: true,
        gasto: gasto
    })),
    on(GastoDetailActions.CreateGastoFailure, (state) => ({
        ...state,
        cargando: false,
        createdSuccess: false
    })),
    on(GastoDetailActions.UpdateGasto, (state) => ({
        ...state,
        cargando: true,
    })),
    on(GastoDetailActions.UpdateGastoSuccess, (state) => ({
        ...state,
        cargando: false,
        createdSuccess: false
    })),
    on(GastoDetailActions.UpdateGastoFailure, (state, action) => ({
        ...state,
        cargando: false,
        createdSuccess: false,
        errorMessage: action.errorMessage
    })),
    on(GastoDetailActions.GetCuentasGasto, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
    })),
    on(GastoDetailActions.GetCuentasGastoSuccess, (state, { cuentas }) => ({
        ...state,
        cargando: false,
        cuentas: cuentas,
        errorCarga: false,
    })),
    on(GastoDetailActions.GetCuentasGastoFailure, (state) => ({
        ...state,
        cargando: false,
        errorCarga: true,
    })),
    on(GastoDetailActions.GetPersonasGasto, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
    })),
    on(GastoDetailActions.GetPersonasGastoSuccess, (state, { personas }) => ({
        ...state,
        cargando: false,
        errorCarga: false,
        personas: personas,
    })),
    on(GastoDetailActions.GetPersonasGastoFailure, (state) => ({
        ...state,
        cargando: false,
        errorCarga: true,
    })),
    on(GastoDetailActions.GetFormasPagoGasto, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
    })),
    on(GastoDetailActions.GetFormasPagoGastoSuccess, (state, { formasPago }) => ({
        ...state,
        cargando: false,
        errorCarga: false,
        formasPago: formasPago,
    })),
    on(GastoDetailActions.GetFormasPagoGastoFailure, (state) => ({
        ...state,
        cargando: false,
        errorCarga: true,
    })),
    on(GastoDetailActions.GetProveedoresGasto, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
    })),
    on(GastoDetailActions.GetProveedoresGastoSuccess, (state, { proveedores }) => ({
        ...state,
        cargando: false,
        errorCarga: false,
        proveedores: proveedores,
    })),
    on(GastoDetailActions.GetProveedoresGastoFailure, (state) => ({
        ...state,
        cargando: false,
        errorCarga: true,
    })),
    on(GastoDetailActions.GetConceptosGasto, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
    })),
    on(GastoDetailActions.GetConceptosGastoSuccess, (state, { conceptos }) => ({
        ...state,
        cargando: false,
        errorCarga: false,
        conceptos: conceptos,
    })),
    on(GastoDetailActions.GetConceptosGastoFailure, (state) => ({
        ...state,
        cargando: false,
        errorCarga: true,
    })),
);

export function GastoDetailReducer(state: GastoDetailState = estadoInicial, action: any): GastoDetailState {
    return gastoDetailReducer(state, action);
}
