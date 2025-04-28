import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Categoria } from "src/app/shared/models/entidades/categoria.model";
import { categoriasListFeatureKey } from "../reducer/categorias-list.reducer";

export const selectCategoriasFeature = createFeatureSelector<EntidadListState<Categoria>>(categoriasListFeatureKey);

export const selectCategoriasList = createSelector(
    selectCategoriasFeature,
    (state: EntidadListState<Categoria>) => state.lista
);

export const selectLoading = createSelector(
    selectCategoriasFeature,
    (state: EntidadListState<Categoria>) => state.loading
);

export const selectErrorCarga = createSelector(
    selectCategoriasFeature,
    (state: EntidadListState<Categoria>) => state.errorCarga
);

