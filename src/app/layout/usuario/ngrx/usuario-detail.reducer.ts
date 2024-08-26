import { createReducer, on } from "@ngrx/store";
import { UsuarioDetailState } from "src/app/shared/models/entidades/estados/usuarioDetailState.model";
import * as UsuarioDetailActions from './usuario-detail.actions'

export const estadoInicial: UsuarioDetailState = { cargando: false, errorCarga: false };

const usuarioDetailReducer = createReducer(
    estadoInicial,
    on(UsuarioDetailActions.DeleteUsuario, (state) => ({
        ...state,
        cargando: true,
    })),
    on(UsuarioDetailActions.DeleteUsuarioSuccess, (state) => ({
        ...state,
        cargando: false,
        usuario: null
    })),
    on(UsuarioDetailActions.DeleteUsuarioFailure, (state) => ({
        ...state,
        cargando: false,
        usuario: null,
    })),
    on(UsuarioDetailActions.UpdateUsuario, (state) => ({
        ...state,
        cargando: true,
    })),
    on(UsuarioDetailActions.UpdateUsuarioSuccess, (state) => ({
        ...state,
        cargando: false,
        createdSuccess: false
    })),
    on(UsuarioDetailActions.UpdateUsuarioFailure, (state, action) => ({
        ...state,
        cargando: false,
    }))
);

export function UsuarioDetailReducer(state: UsuarioDetailState = estadoInicial, action: any): UsuarioDetailState {
    return usuarioDetailReducer(state, action);
}
