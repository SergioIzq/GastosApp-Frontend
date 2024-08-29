import { createReducer, on } from "@ngrx/store";
import { FormaPagoDetailState } from "src/app/shared/models/entidades/estados/formaPagoDetailState.model";
import * as FormaPagoDetailActions from '../actions/forma-pago-detail.actions'

export const estadoInicial: FormaPagoDetailState = { loading: false, formaPagoPorId: null, errorCarga: false };

const formaPagoDetailReducer = createReducer(
    estadoInicial,
    on(FormaPagoDetailActions.GetFormaPago, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(FormaPagoDetailActions.GetFormaPagoSuccess, (state, { formaPagoPorId }) => ({
        ...state,
        loading: false,
        formaPagoPorId: formaPagoPorId,
        errorCarga: false,
        createdSuccess: false
    })),
    on(FormaPagoDetailActions.GetFormaPagoFail, (state) => ({
        ...state,
        loading: false,
        formaPagoPorId: null,
        errorCarga: true,
        createdSuccess: false
    })),

    on(FormaPagoDetailActions.CreateFormaPago, (state) => ({
        ...state,
        loading: true,
        createdSuccess: false
    })),
    on(FormaPagoDetailActions.CreateFormaPagoSuccess, (state, { formaPago }) => ({
        ...state,
        loading: false,
        createdSuccess: true,
        formaPago: formaPago
    })),
    on(FormaPagoDetailActions.CreateFormaPagoFailure, (state) => ({
        ...state,
        loading: false,
        formaPago: null,
        createdSuccess: false
    })),
    on(FormaPagoDetailActions.UpdateFormaPago, (state) => ({
        ...state,
        loading: true,
        createdSuccess: false
    })),
    on(FormaPagoDetailActions.UpdateFormaPagoSuccess, (state) => ({
        ...state,
        loading: false,
        createdSuccess: false
    })),
    on(FormaPagoDetailActions.UpdateFormaPagoFailure, (state, action) => ({
        ...state,
        loading: false,
        createdSuccess: false
    }))
);

export function FormaPagoDetailReducer(state: FormaPagoDetailState = estadoInicial, action: any): FormaPagoDetailState {
    return formaPagoDetailReducer(state, action);
}
