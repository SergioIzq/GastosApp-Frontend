import { createReducer, on } from "@ngrx/store";
import * as ProveedorsListActions from '../actions/proveedores-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Proveedor } from "src/app/shared/models/entidades/proveedor.model";

export const estadoInicial: EntidadListState<Proveedor> = { loading: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };

export const proveedoresListReducer = createReducer(
    estadoInicial,
    on(ProveedorsListActions.LoadingProveedores, (state) => {
        return {
            ...state,
            loading: true,
        }
    }),
    on(ProveedorsListActions.LoadingProveedoresSuccess, (state, { listaProveedores }) => {
        return {
            ...state,
            loading: false,
            lista: listaProveedores
        };
    }),
    on(ProveedorsListActions.LoadingProveedoresFailure, (state) => {
        return {
            ...state,
            loading: false,
            errorCarga: true,
            lista: { TotalRecords: 0, Items: [] }
        };
    }),
    on(ProveedorsListActions.DeleteProveedorSuccess, (state) => {
        return {
            ...state,
            loading: false,        
            errorCarga: true    
        };
    }),
    on(ProveedorsListActions.DeleteProveedorFailure, (state, action) => {
        return {
            ...state,
            loading: false,            
            errorMessage: action.errorMessage,
        };
    }),
)