import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Categoria } from "src/app/shared/models/entidades/categoria.model";

export const selectCategoriasFeature = (state: AppState) => state.listaCategorias

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

