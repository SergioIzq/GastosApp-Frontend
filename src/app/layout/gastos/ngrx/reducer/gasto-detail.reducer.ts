import { createReducer, on } from "@ngrx/store";
import { GastoDetailState } from "src/app/shared/models/entidades/estados/gastoDetailState.model";
import * as GastoDetailActions from '../actions/gasto-detail.actions'

export const estadoInicial: GastoDetailState = { loading: false, gastoPorId: null, errorCarga: false, errorMessage: '', personas: null, cuentas: null, formasPago: null, conceptos: null, proveedores: null };

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
        gasto: gasto
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
    on(GastoDetailActions.GetCuentasGasto, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
    })),
    on(GastoDetailActions.GetCuentasGastoSuccess, (state, { cuentas }) => ({
        ...state,
        loading: false,
        cuentas: cuentas,
        errorCarga: false,
    })),
    on(GastoDetailActions.GetCuentasGastoFailure, (state) => ({
        ...state,
        loading: false,
        errorCarga: true,
    })),
    on(GastoDetailActions.GetPersonasGasto, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
    })),
    on(GastoDetailActions.GetPersonasGastoSuccess, (state, { personas }) => ({
        ...state,
        loading: false,
        errorCarga: false,
        personas: personas,
    })),
    on(GastoDetailActions.GetPersonasGastoFailure, (state) => ({
        ...state,
        loading: false,
        errorCarga: true,
    })),
    on(GastoDetailActions.GetFormasPagoGasto, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
    })),
    on(GastoDetailActions.GetFormasPagoGastoSuccess, (state, { formasPago }) => ({
        ...state,
        loading: false,
        errorCarga: false,
        formasPago: formasPago,
    })),
    on(GastoDetailActions.GetFormasPagoGastoFailure, (state) => ({
        ...state,
        loading: false,
        errorCarga: true,
    })),
    on(GastoDetailActions.GetProveedoresGasto, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
    })),
    on(GastoDetailActions.GetProveedoresGastoSuccess, (state, { proveedores }) => ({
        ...state,
        loading: false,
        errorCarga: false,
        proveedores: proveedores,
    })),
    on(GastoDetailActions.GetProveedoresGastoFailure, (state) => ({
        ...state,
        loading: false,
        errorCarga: true,
    })),
    on(GastoDetailActions.GetConceptosGasto, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
    })),
    on(GastoDetailActions.GetConceptosGastoSuccess, (state, { conceptos }) => ({
        ...state,
        loading: false,
        errorCarga: false,
        conceptos: conceptos,
    })),
    on(GastoDetailActions.GetConceptosGastoFailure, (state) => ({
        ...state,
        loading: false,
        errorCarga: true,
    })),
);

export function GastoDetailReducer(state: GastoDetailState = estadoInicial, action: any): GastoDetailState {
    return gastoDetailReducer(state, action);
}
