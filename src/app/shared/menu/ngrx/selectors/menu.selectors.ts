import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MenuState } from "src/app/shared/models/entidades/estados/menustate.model";
import { menuFeatureKey } from "../reducer/menu.reducer";

export const selectMenuFeature = createFeatureSelector<MenuState>(menuFeatureKey);

export const selectUsuarioPorId = createSelector(
    selectMenuFeature,
    (state: MenuState) => state.usuarioPorId
);

export const selectLoading = createSelector(
    selectMenuFeature,
    (state: MenuState) => state.loading
);