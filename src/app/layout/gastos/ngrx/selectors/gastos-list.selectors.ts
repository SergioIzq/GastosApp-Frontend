import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Gasto } from "src/app/shared/models/entidades/gasto.model";
import { gastosListFeatureKey } from "../reducer/gastos-list.reducer";

export const selectGastosFeature = createFeatureSelector<EntidadListState<Gasto>>(gastosListFeatureKey);

export const selectGastosList = createSelector(
    selectGastosFeature,
    (state: EntidadListState<any>) => state.lista
);

export const selectLoading = createSelector(
    selectGastosFeature,
    (state: EntidadListState<Gasto>) => state.loading
);

export const selectErrorCarga = createSelector(
    selectGastosFeature,
    (state: EntidadListState<Gasto>) => state.errorCarga
);