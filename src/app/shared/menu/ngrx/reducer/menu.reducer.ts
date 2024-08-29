import { createReducer, on } from '@ngrx/store';
import * as MenuActions from '../actions/menu.actions';
import { MenuState } from 'src/app/shared/models/entidades/estados/menustate.model';

export const estadoincial: MenuState = { usuarioPorId: null, loading: false };

const menuReducer = createReducer(
    estadoincial,
    on(MenuActions.GetUsuario, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
    })),
    on(MenuActions.GetUsuarioSuccess, (state, { usuarioPorId }) => ({
        ...state,
        loading: false,
        usuarioPorId: usuarioPorId,        
        errorCarga: false,
    })),
    on(MenuActions.GetUsuarioFail, (state) => ({
        ...state,
        loading: false,
        usuarioPorId: null,
        errorCarga: true,
    })),
);

export function MenuReducer(state: MenuState = estadoincial, action: any): MenuState {
    return menuReducer(state, action);
}
