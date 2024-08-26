import { createReducer, on } from "@ngrx/store";
import * as ClientesListActions from '../actions/clientes-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Cliente } from "src/app/shared/models/entidades/cliente.model";

export const estadoInicial: EntidadListState<Cliente> = { cargando: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };

export const clientesListReducer = createReducer(
    estadoInicial,
    on(ClientesListActions.LoadingClientes, (state) => {
        return {
            ...state,
            cargando: true,
        }
    }),
    on(ClientesListActions.LoadingClientesSuccess, (state, { listaClientes }) => {
        return {
            ...state,
            cargando: false,
            lista: listaClientes
        };
    }),
    on(ClientesListActions.LoadingClientesFailure, (state) => {
        return {
            ...state,
            cargando: false,
            errorCarga: true,
            lista: { TotalRecords: 0, Items: [] }
        };
    }),
    on(ClientesListActions.DeleteCliente, (state) => {
        return {
            ...state,
            cargando: true,        
            errorCarga: false    
        };
    }),
    on(ClientesListActions.DeleteClienteSuccess, (state) => {
        return {
            ...state,
            cargando: false,        
            errorCarga: true    
        };
    }),
    on(ClientesListActions.DeleteClienteFailure, (state, action) => {
        return {
            ...state,
            cargando: false,            
            errorMessage: action.errorMessage,
        };
    }),
)