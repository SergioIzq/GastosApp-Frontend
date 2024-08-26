import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { UsuarioDetailState } from '../../../shared/models/entidades/estados/usuarioDetailState.model';


export const selectUsuarioDetailFeature = (state: AppState) => state.usuario;

export const selectCargando = createSelector(
    selectUsuarioDetailFeature,
    (state: UsuarioDetailState) => state.cargando
);

export const selectErrorCarga = createSelector(
    selectUsuarioDetailFeature,
    (state: UsuarioDetailState) => state.errorCarga
);