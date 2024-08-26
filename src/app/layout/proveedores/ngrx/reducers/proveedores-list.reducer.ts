import { createReducer, on } from "@ngrx/store";
import * as ProveedorsListActions from '../actions/proveedores-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Proveedor } from "src/app/shared/models/entidades/proveedor.model";

export const estadoInicial: EntidadListState<Proveedor> = { cargando: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };

export const proveedoresListReducer = createReducer(
    estadoInicial,
    on(ProveedorsListActions.LoadingProveedores, (state) => {
        return {
            ...state,
            cargando: true,
        }
    }),
    on(ProveedorsListActions.LoadingProveedoresSuccess, (state, { listaProveedores }) => {
        return {
            ...state,
            cargando: false,
            lista: listaProveedores
        };
    }),
    on(ProveedorsListActions.LoadingProveedoresFailure, (state) => {
        return {
            ...state,
            cargando: false,
            errorCarga: true,
            lista: { TotalRecords: 0, Items: [] }
        };
    }),
    on(ProveedorsListActions.DeleteProveedorSuccess, (state) => {
        return {
            ...state,
            cargando: false,        
            errorCarga: true    
        };
    }),
    on(ProveedorsListActions.DeleteProveedorFailure, (state, action) => {
        return {
            ...state,
            cargando: false,            
            errorMessage: action.errorMessage,
        };
    }),
)