import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { GastoProgramado } from "src/app/shared/models/entidades/gastoProgramado.model";
import { gastosProgramadosListFeatureKey } from "../reducer/gastos-programados-list.reducer";

export const selectGastosProgramadosFeature = createFeatureSelector<EntidadListState<GastoProgramado>>(gastosProgramadosListFeatureKey);

export const selectGastosList = createSelector(
    selectGastosProgramadosFeature,
    (state: EntidadListState<any>) => state.lista
);

export const selectLoading = createSelector(
    selectGastosProgramadosFeature,
    (state: EntidadListState<GastoProgramado>) => state.loading
);

export const selectErrorCarga = createSelector(
    selectGastosProgramadosFeature,
    (state: EntidadListState<GastoProgramado>) => state.errorCarga
);