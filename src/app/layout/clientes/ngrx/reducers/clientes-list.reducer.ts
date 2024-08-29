import { createReducer, on } from "@ngrx/store";
import * as ClientesListActions from '../actions/clientes-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Cliente } from "src/app/shared/models/entidades/cliente.model";

export const estadoInicial: EntidadListState<Cliente> = { loading: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };

export const clientesListReducer = createReducer(
    estadoInicial,
    on(ClientesListActions.LoadingClientes, (state) => {
        return {
            ...state,
            loading: true,
        }
    }),
    on(ClientesListActions.LoadingClientesSuccess, (state, { listaClientes }) => {
        return {
            ...state,
            loading: false,
            lista: listaClientes
        };
    }),
    on(ClientesListActions.LoadingClientesFailure, (state) => {
        return {
            ...state,
            loading: false,
            errorCarga: true,
            lista: { TotalRecords: 0, Items: [] }
        };
    }),
    on(ClientesListActions.DeleteCliente, (state) => {
        return {
            ...state,
            loading: true,        
            errorCarga: false    
        };
    }),
    on(ClientesListActions.DeleteClienteSuccess, (state) => {
        return {
            ...state,
            loading: false,        
            errorCarga: true    
        };
    }),
    on(ClientesListActions.DeleteClienteFailure, (state, action) => {
        return {
            ...state,
            loading: false,            
            errorMessage: action.errorMessage,
        };
    }),
)