import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Resumen } from "src/app/shared/models/entidades/resumen.model";
import { ResumenListState } from "src/app/shared/models/entidades/estados/resumenListState.model";

export const selectResumenFeature = (state: AppState) => state.resumen

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