import { createReducer, on } from "@ngrx/store";
import { ClienteDetailState } from "src/app/shared/models/entidades/estados/clienteDetail.model";
import * as ClienteDetailActions from '../actions/cliente-detail.actions'

export const estadoInicial: ClienteDetailState = { loading: false, clientePorId: null, errorCarga: false };

const clienteDetailReducer = createReducer(
    estadoInicial,
    on(ClienteDetailActions.GetCliente, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(ClienteDetailActions.GetClienteSuccess, (state, { clientePorId }) => ({
        ...state,
        loading: false,
        clientePorId: clientePorId,
        errorCarga: false,
        createdSuccess: false
    })),
    on(ClienteDetailActions.GetClienteFail, (state) => ({
        ...state,
        loading: false,
        clientePorId: null,
        errorCarga: true,
        createdSuccess: false
    })),

    on(ClienteDetailActions.CreateCliente, (state) => ({
        ...state,
        loading: true,
        createdSuccess: false
    })),
    on(ClienteDetailActions.CreateClienteSuccess, (state, { cliente }) => ({
        ...state,
        loading: false,
        createdSuccess: true,
        cliente: cliente
    })),
    on(ClienteDetailActions.CreateClienteFailure, (state) => ({
        ...state,
        loading: false,
        cliente: null,
        createdSuccess: false
    })),
    on(ClienteDetailActions.UpdateCliente, (state) => ({
        ...state,
        loading: true,
        createdSuccess: false
    })),
    on(ClienteDetailActions.UpdateClienteSuccess, (state) => ({
        ...state,
        loading: false,
        createdSuccess: false
    })),
    on(ClienteDetailActions.UpdateClienteFailure, (state, action) => ({
        ...state,
        loading: false,
        createdSuccess: false
    }))
);

export function ClienteDetailReducer(state: ClienteDetailState = estadoInicial, action: any): ClienteDetailState {
    return clienteDetailReducer(state, action);
}
