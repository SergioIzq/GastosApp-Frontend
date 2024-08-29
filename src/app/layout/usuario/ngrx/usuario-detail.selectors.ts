import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { UsuarioDetailState } from '../../../shared/models/entidades/estados/usuarioDetailState.model';


export const selectUsuarioDetailFeature = (state: AppState) => state.usuario;

export const selectLoading = createSelector(
    selectUsuarioDetailFeature,
    (state: UsuarioDetailState) => state.loading
);

export const selectErrorCarga = createSelector(
    selectUsuarioDetailFeature,
    (state: UsuarioDetailState) => state.errorCarga
);