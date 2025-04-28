import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsuarioDetailState } from '../../../shared/models/entidades/estados/usuarioDetailState.model';
import { usuarioDetailFeatureKey } from './usuario-detail.reducer';

export const selectUsuarioDetailFeature = createFeatureSelector<UsuarioDetailState>(usuarioDetailFeatureKey);

export const selectLoading = createSelector(
    selectUsuarioDetailFeature,
    (state: UsuarioDetailState) => state.loading
);

export const selectErrorCarga = createSelector(
    selectUsuarioDetailFeature,
    (state: UsuarioDetailState) => state.errorCarga
);