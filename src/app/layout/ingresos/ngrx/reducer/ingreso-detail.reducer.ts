import { createReducer, on } from "@ngrx/store";
import { IngresoDetailState } from "src/app/shared/models/entidades/estados/ingresoDetailState.model";
import * as IngresoDetailActions from '../actions/ingreso-detail.actions'

export const estadoInicial: IngresoDetailState = { cargando: false, ingresoPorId: null, errorCarga: false, errorMessage: '', personas: null, cuentas: null, formasPago: null, conceptos: null, clientes: null };

const ingresoDetailReducer = createReducer(
    estadoInicial,
    on(IngresoDetailActions.GetIngreso, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
    })),
    on(IngresoDetailActions.GetIngresoSuccess, (state, { ingreso }) => ({
        ...state,
        cargando: false,
        ingresoPorId: ingreso,
        errorCarga: false,
    })),
    on(IngresoDetailActions.GetIngresoFail, (state) => ({
        ...state,
        cargando: false,
        ingresoPorId: null,
        errorCarga: true,
    })),
    on(IngresoDetailActions.CreateIngreso, (state) => ({
        ...state,
        cargando: true,
    })),
    on(IngresoDetailActions.CreateIngresoSuccess, (state, { ingreso }) => ({
        ...state,
        cargando: false,
        ingreso: ingreso
    })),
    on(IngresoDetailActions.CreateIngresoFailure, (state) => ({
        ...state,
        cargando: false,
    })),
    on(IngresoDetailActions.UpdateIngreso, (state) => ({
        ...state,
        cargando: true,
    })),
    on(IngresoDetailActions.UpdateIngresoSuccess, (state) => ({
        ...state,
        cargando: false,
    })),
    on(IngresoDetailActions.UpdateIngresoFailure, (state, action) => ({
        ...state,
        cargando: false,
        errorMessage: action.errorMessage
    })),
    on(IngresoDetailActions.GetCuentasIngreso, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
    })),
    on(IngresoDetailActions.GetCuentasIngresoSuccess, (state, { cuentas }) => ({
        ...state,
        cargando: false,
        errorCarga: false,
        cuentas: cuentas,
    })),
    on(IngresoDetailActions.GetCuentasIngresoFailure, (state) => ({
        ...state,
        cargando: false,
        errorCarga: true,
    })),
    on(IngresoDetailActions.GetPersonasIngreso, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
    })),
    on(IngresoDetailActions.GetPersonasIngresoSuccess, (state, { personas }) => ({
        ...state,
        cargando: false,
        errorCarga: false,
        personas: personas,
    })),
    on(IngresoDetailActions.GetPersonasIngresoFailure, (state) => ({
        ...state,
        cargando: false,
        errorCarga: true,
    })),
    on(IngresoDetailActions.GetFormasPagoIngreso, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
    })),
    on(IngresoDetailActions.GetFormasPagoIngresoSuccess, (state, { formasPago }) => ({
        ...state,
        cargando: false,
        errorCarga: false,
        formasPago: formasPago,
    })),
    on(IngresoDetailActions.GetFormasPagoIngresoFailure, (state) => ({
        ...state,
        cargando: false,
        errorCarga: true,
    })),
    on(IngresoDetailActions.GetClientesIngreso, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
    })),
    on(IngresoDetailActions.GetClientesIngresoSuccess, (state, { clientes }) => ({
        ...state,
        cargando: false,
        errorCarga: false,
        clientes: clientes,
    })),
    on(IngresoDetailActions.GetClientesIngresoFailure, (state) => ({
        ...state,
        cargando: false,
        errorCarga: true,
    })),
    on(IngresoDetailActions.GetConceptosIngreso, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
    })),
    on(IngresoDetailActions.GetConceptosIngresoSuccess, (state, { conceptos }) => ({
        ...state,
        cargando: false,
        errorCarga: false,
        conceptos: conceptos,
    })),
    on(IngresoDetailActions.GetConceptosIngresoFailure, (state) => ({
        ...state,
        cargando: false,
        errorCarga: true,
    })),
);

export function IngresoDetailReducer(state: IngresoDetailState = estadoInicial, action: any): IngresoDetailState {
    return ingresoDetailReducer(state, action);
}
