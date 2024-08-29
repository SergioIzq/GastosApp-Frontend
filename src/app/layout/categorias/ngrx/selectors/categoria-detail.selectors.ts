import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { CategoriaDetailState } from 'src/app/shared/models/entidades/estados/categoriaDetail.model';


export const selectCategoriaDetailFeature = (state: AppState) => state.categoriaPorId;

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
