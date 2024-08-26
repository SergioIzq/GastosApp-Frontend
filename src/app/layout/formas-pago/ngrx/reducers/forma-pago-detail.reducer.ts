import { createReducer, on } from "@ngrx/store";
import { FormaPagoDetailState } from "src/app/shared/models/entidades/estados/formaPagoDetailState.model";
import * as FormaPagoDetailActions from '../actions/forma-pago-detail.actions'

export const estadoInicial: FormaPagoDetailState = { cargando: false, formaPagoPorId: null, errorCarga: false };

const formaPagoDetailReducer = createReducer(
    estadoInicial,
    on(FormaPagoDetailActions.GetFormaPago, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(FormaPagoDetailActions.GetFormaPagoSuccess, (state, { formaPagoPorId }) => ({
        ...state,
        cargando: false,
        formaPagoPorId: formaPagoPorId,
        errorCarga: false,
        createdSuccess: false
    })),
    on(FormaPagoDetailActions.GetFormaPagoFail, (state) => ({
        ...state,
        cargando: false,
        formaPagoPorId: null,
        errorCarga: true,
        createdSuccess: false
    })),

    on(FormaPagoDetailActions.CreateFormaPago, (state) => ({
        ...state,
        cargando: true,
        createdSuccess: false
    })),
    on(FormaPagoDetailActions.CreateFormaPagoSuccess, (state, { formaPago }) => ({
        ...state,
        cargando: false,
        createdSuccess: true,
        formaPago: formaPago
    })),
    on(FormaPagoDetailActions.CreateFormaPagoFailure, (state) => ({
        ...state,
        cargando: false,
        formaPago: null,
        createdSuccess: false
    })),
    on(FormaPagoDetailActions.UpdateFormaPago, (state) => ({
        ...state,
        cargando: true,
        createdSuccess: false
    })),
    on(FormaPagoDetailActions.UpdateFormaPagoSuccess, (state) => ({
        ...state,
        cargando: false,
        createdSuccess: false
    })),
    on(FormaPagoDetailActions.UpdateFormaPagoFailure, (state, action) => ({
        ...state,
        cargando: false,
        createdSuccess: false
    }))
);

export function FormaPagoDetailReducer(state: FormaPagoDetailState = estadoInicial, action: any): FormaPagoDetailState {
    return formaPagoDetailReducer(state, action);
}
