import { createReducer, on } from "@ngrx/store";
import { UsuarioDetailState } from "src/app/shared/models/entidades/estados/usuarioDetailState.model";
import * as UsuarioDetailActions from './usuario-detail.actions'

export const estadoInicial: UsuarioDetailState = { loading: false, errorCarga: false };
export const usuarioDetailFeatureKey = 'usuarioDetailState';

const usuarioDetailReducer = createReducer(
    estadoInicial,
    on(UsuarioDetailActions.DeleteUsuario, (state) => ({
        ...state,
        loading: true,
    })),
    on(UsuarioDetailActions.DeleteUsuarioSuccess, (state) => ({
        ...state,
        loading: false,
        usuario: null
    })),
    on(UsuarioDetailActions.DeleteUsuarioFailure, (state) => ({
        ...state,
        loading: false,
        usuario: null,
    })),
    on(UsuarioDetailActions.UpdateUsuario, (state) => ({
        ...state,
        loading: true,
    })),
    on(UsuarioDetailActions.UpdateUsuarioSuccess, (state) => ({
        ...state,
        loading: false,
        createdSuccess: false
    })),
    on(UsuarioDetailActions.UpdateUsuarioFailure, (state, action) => ({
        ...state,
        loading: false,
    }))
);

export function reducer(state: UsuarioDetailState = estadoInicial, action: any): UsuarioDetailState {
    return usuarioDetailReducer(state, action);
}
