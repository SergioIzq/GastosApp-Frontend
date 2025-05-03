import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ResumenListState } from "src/app/shared/models/entidades/estados/resumenListState.model";
import { resumenListFeatureKey } from "../reducers/resumen-list.reducer";

export const selectResumenFeature = createFeatureSelector<ResumenListState>(resumenListFeatureKey);

export const selectListaGastos = createSelector(
    selectResumenFeature,
    (state: ResumenListState) => state.listaGastos
);

export const selectListaIngresos = createSelector(
    selectResumenFeature,
    (state: ResumenListState) => state.listaIngresos
);

export const selectLoading = createSelector(
    selectResumenFeature,
    (state: ResumenListState) => state.loading
);

export const selectErrorCarga = createSelector(
    selectResumenFeature,
    (state: ResumenListState) => state.errorCarga
);