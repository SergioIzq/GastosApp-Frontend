import { createReducer, on } from "@ngrx/store";
import * as FormaPagosListActions from '../actions/formas-pago-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { FormaPago } from "src/app/shared/models/entidades/formaPago.model";

export const estadoInicial: EntidadListState<FormaPago> = { loading: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };
export const formasPagoListFeatureKey = 'formasPagoListState';

export const formasPagoListReducer = createReducer(
    estadoInicial,
    on(FormaPagosListActions.LoadingFormasPago, (state) => {
        return {
            ...state,
            loading: true,
        }
    }),
    on(FormaPagosListActions.LoadingFormasPagoSuccess, (state, { listaFormasPago }) => {
        return {
            ...state,
            loading: false,
            lista: listaFormasPago
        };
    }),
    on(FormaPagosListActions.LoadingFormasPagoFailure, (state) => {
        return {
            ...state,
            loading: false,
            errorCarga: true,
            lista: { TotalRecords: 0, Items: [] }
        };
    }),
    on(FormaPagosListActions.DeleteFormaPagoSuccess, (state) => {
        return {
            ...state,
            loading: false,        
            errorCarga: true    
        };
    }),
    on(FormaPagosListActions.DeleteFormaPagoFailure, (state, action) => {
        return {
            ...state,
            loading: false,            
            errorMessage: action.errorMessage,
        };
    }),
)

export function reducer(state: EntidadListState<FormaPago> = estadoInicial, action: any): EntidadListState<FormaPago> {
    return formasPagoListReducer(state, action);
}