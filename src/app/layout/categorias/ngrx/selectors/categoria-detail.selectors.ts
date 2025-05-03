import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoriaDetailState } from 'src/app/shared/models/entidades/estados/categoriaDetail.model';
import { categoriaDetailFeatureKey } from '../reducer/categoria-detail.reducer';

export const selectCategoriaDetailFeature = createFeatureSelector<CategoriaDetailState>(categoriaDetailFeatureKey);

export const selectedCategoriaSelector = createSelector(
    selectCategoriaDetailFeature,
    (state: CategoriaDetailState) => state.categoriaPorId
);

export const selectLoading = createSelector(
    selectCategoriaDetailFeature,
    (state: CategoriaDetailState) => state.loading
);

export const selectErrorCarga = createSelector(
    selectCategoriaDetailFeature,
    (state: CategoriaDetailState) => state.errorCarga
);
