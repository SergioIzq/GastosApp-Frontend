import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { ingresosProgramadosListFeatureKey } from "../reducer/ingresos-programados-list.reducer";
import { IngresoProgramado } from "src/app/shared/models/entidades/ingresoProgramado.model";

export const selectIngresosProgramadosFeature = createFeatureSelector<EntidadListState<IngresoProgramado>>(ingresosProgramadosListFeatureKey);

export const selectIngresosList = createSelector(
    selectIngresosProgramadosFeature,
    (state: EntidadListState<any>) => state.lista
);

export const selectLoading = createSelector(
    selectIngresosProgramadosFeature,
    (state: EntidadListState<IngresoProgramado>) => state.loading
);

export const selectErrorCarga = createSelector(
    selectIngresosProgramadosFeature,
    (state: EntidadListState<IngresoProgramado>) => state.errorCarga
);