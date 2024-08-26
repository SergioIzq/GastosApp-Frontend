import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { CategoriaDetailState } from 'src/app/shared/models/entidades/estados/categoriaDetail.model';


export const selectCategoriaDetailFeature = (state: AppState) => state.categoriaPorId;

export const selectedCategoriaSelector = createSelector(
    selectCategoriaDetailFeature,
    (state: CategoriaDetailState) => state.categoriaPorId
);

export const selectCargando = createSelector(
    selectCategoriaDetailFeature,
    (state: CategoriaDetailState) => state.cargando
);

export const selectErrorCarga = createSelector(
    selectCategoriaDetailFeature,
    (state: CategoriaDetailState) => state.errorCarga
);
