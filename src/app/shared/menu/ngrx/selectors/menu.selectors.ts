import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";
import { MenuState } from "src/app/shared/models/entidades/estados/menustate.model";

export const selectMenuFeature = (state: AppState) => state.menu

export const selectUsuarioPorId = createSelector(
    selectMenuFeature,
    (state: MenuState) => state.usuarioPorId
);
