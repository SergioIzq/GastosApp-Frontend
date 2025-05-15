import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { traspasosProgramadosListFeatureKey } from "../reducer/traspasos-programados-list.reducer";
import { TraspasoProgramado } from "src/app/shared/models/entidades/traspasoProgramado.model";

export const selectTraspasosProgramadosFeature = createFeatureSelector<EntidadListState<TraspasoProgramado>>(traspasosProgramadosListFeatureKey);

export const selectTraspasosList = createSelector(
    selectTraspasosProgramadosFeature,
    (state: EntidadListState<any>) => state.lista
);

export const selectLoading = createSelector(
    selectTraspasosProgramadosFeature,
    (state: EntidadListState<TraspasoProgramado>) => state.loading
);

export const selectErrorCarga = createSelector(
    selectTraspasosProgramadosFeature,
    (state: EntidadListState<TraspasoProgramado>) => state.errorCarga
);