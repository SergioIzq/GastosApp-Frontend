import { createReducer, on } from "@ngrx/store";
import { ClienteDetailState } from "src/app/shared/models/entidades/estados/clienteDetail.model";
import * as ClienteDetailActions from '../actions/cliente-detail.actions'

export const estadoInicial: ClienteDetailState = { cargando: false, clientePorId: null, errorCarga: false };

const clienteDetailReducer = createReducer(
    estadoInicial,
    on(ClienteDetailActions.GetCliente, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(ClienteDetailActions.GetClienteSuccess, (state, { clientePorId }) => ({
        ...state,
        cargando: false,
        clientePorId: clientePorId,
        errorCarga: false,
        createdSuccess: false
    })),
    on(ClienteDetailActions.GetClienteFail, (state) => ({
        ...state,
        cargando: false,
        clientePorId: null,
        errorCarga: true,
        createdSuccess: false
    })),

    on(ClienteDetailActions.CreateCliente, (state) => ({
        ...state,
        cargando: true,
        createdSuccess: false
    })),
    on(ClienteDetailActions.CreateClienteSuccess, (state, { cliente }) => ({
        ...state,
        cargando: false,
        createdSuccess: true,
        cliente: cliente
    })),
    on(ClienteDetailActions.CreateClienteFailure, (state) => ({
        ...state,
        cargando: false,
        cliente: null,
        createdSuccess: false
    })),
    on(ClienteDetailActions.UpdateCliente, (state) => ({
        ...state,
        cargando: true,
        createdSuccess: false
    })),
    on(ClienteDetailActions.UpdateClienteSuccess, (state) => ({
        ...state,
        cargando: false,
        createdSuccess: false
    })),
    on(ClienteDetailActions.UpdateClienteFailure, (state, action) => ({
        ...state,
        cargando: false,
        createdSuccess: false
    }))
);

export function ClienteDetailReducer(state: ClienteDetailState = estadoInicial, action: any): ClienteDetailState {
    return clienteDetailReducer(state, action);
}
