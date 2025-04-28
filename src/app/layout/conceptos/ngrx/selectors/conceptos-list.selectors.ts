import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Concepto } from "src/app/shared/models/entidades/concepto.model";
import { conceptosListFeatureKey } from "../reducers/conceptos-list.reducer";

export const selectConceptosFeature = createFeatureSelector<EntidadListState<Concepto>>(conceptosListFeatureKey);

export const selectConceptosList = createSelector(
    selectConceptosFeature,
    (state: EntidadListState<any>) => state.lista
);

export const selectLoading = createSelector(
    selectConceptosFeature,
    (state: EntidadListState<Concepto>) => state.loading
);

export const selectErrorCarga = createSelector(
    selectConceptosFeature,
    (state: EntidadListState<Concepto>) => state.errorCarga
);

