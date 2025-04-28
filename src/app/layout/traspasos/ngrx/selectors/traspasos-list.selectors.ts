import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Traspaso } from "src/app/shared/models/entidades/traspaso.model";
import { traspasosListFeatureKey } from "../reducers/traspasos-list.reducer";

export const selectTraspasosFeature = createFeatureSelector<EntidadListState<Traspaso>>(traspasosListFeatureKey);

export const selectTraspasosList = createSelector(
    selectTraspasosFeature,
    (state: EntidadListState<any>) => state.lista
);

export const selectLoading = createSelector(
    selectTraspasosFeature,
    (state: EntidadListState<Traspaso>) => state.loading
);

export const selectErrorCarga = createSelector(
    selectTraspasosFeature,
    (state: EntidadListState<Traspaso>) => state.errorCarga
);

