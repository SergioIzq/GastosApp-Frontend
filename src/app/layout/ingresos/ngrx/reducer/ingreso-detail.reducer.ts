import { createReducer, on } from "@ngrx/store";
import { IngresoDetailState } from "src/app/shared/models/entidades/estados/ingresoDetailState.model";
import * as IngresoDetailActions from '../actions/ingreso-detail.actions'

export const estadoInicial: IngresoDetailState = { loading: false, ingresoPorId: null, errorCarga: false, errorMessage: '', personas: null, cuentas: null, formasPago: null, conceptos: null, clientes: null };

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
    on(IngresoDetailActions.GetCuentasIngreso, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
    })),
    on(IngresoDetailActions.GetCuentasIngresoSuccess, (state, { cuentas }) => ({
        ...state,
        loading: false,
        errorCarga: false,
        cuentas: cuentas,
    })),
    on(IngresoDetailActions.GetCuentasIngresoFailure, (state) => ({
        ...state,
        loading: false,
        errorCarga: true,
    })),
    on(IngresoDetailActions.GetPersonasIngreso, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
    })),
    on(IngresoDetailActions.GetPersonasIngresoSuccess, (state, { personas }) => ({
        ...state,
        loading: false,
        errorCarga: false,
        personas: personas,
    })),
    on(IngresoDetailActions.GetPersonasIngresoFailure, (state) => ({
        ...state,
        loading: false,
        errorCarga: true,
    })),
    on(IngresoDetailActions.GetFormasPagoIngreso, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
    })),
    on(IngresoDetailActions.GetFormasPagoIngresoSuccess, (state, { formasPago }) => ({
        ...state,
        loading: false,
        errorCarga: false,
        formasPago: formasPago,
    })),
    on(IngresoDetailActions.GetFormasPagoIngresoFailure, (state) => ({
        ...state,
        loading: false,
        errorCarga: true,
    })),
    on(IngresoDetailActions.GetClientesIngreso, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
    })),
    on(IngresoDetailActions.GetClientesIngresoSuccess, (state, { clientes }) => ({
        ...state,
        loading: false,
        errorCarga: false,
        clientes: clientes,
    })),
    on(IngresoDetailActions.GetClientesIngresoFailure, (state) => ({
        ...state,
        loading: false,
        errorCarga: true,
    })),
    on(IngresoDetailActions.GetConceptosIngreso, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
    })),
    on(IngresoDetailActions.GetConceptosIngresoSuccess, (state, { conceptos }) => ({
        ...state,
        loading: false,
        errorCarga: false,
        conceptos: conceptos,
    })),
    on(IngresoDetailActions.GetConceptosIngresoFailure, (state) => ({
        ...state,
        loading: false,
        errorCarga: true,
    })),
);

export function IngresoDetailReducer(state: IngresoDetailState = estadoInicial, action: any): IngresoDetailState {
    return ingresoDetailReducer(state, action);
}
