import { createReducer, on } from "@ngrx/store";
import * as FormaPagosListActions from '../actions/formas-pago-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { FormaPago } from "src/app/shared/models/entidades/formaPago.model";

export const estadoInicial: EntidadListState<FormaPago> = { cargando: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };

export const formasPagoListReducer = createReducer(
    estadoInicial,
    on(FormaPagosListActions.LoadingFormasPago, (state) => {
        return {
            ...state,
            cargando: true,
        }
    }),
    on(FormaPagosListActions.LoadingFormasPagoSuccess, (state, { listaFormasPago }) => {
        return {
            ...state,
            cargando: false,
            lista: listaFormasPago
        };
    }),
    on(FormaPagosListActions.LoadingFormasPagoFailure, (state) => {
        return {
            ...state,
            cargando: false,
            errorCarga: true,
            lista: { TotalRecords: 0, Items: [] }
        };
    }),
    on(FormaPagosListActions.DeleteFormaPagoSuccess, (state) => {
        return {
            ...state,
            cargando: false,        
            errorCarga: true    
        };
    }),
    on(FormaPagosListActions.DeleteFormaPagoFailure, (state, action) => {
        return {
            ...state,
            cargando: false,            
            errorMessage: action.errorMessage,
        };
    }),
)