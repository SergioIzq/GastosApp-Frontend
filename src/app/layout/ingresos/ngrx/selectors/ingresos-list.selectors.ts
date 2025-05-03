import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Ingreso } from "src/app/shared/models/entidades/ingreso.model";
import { ingresosListFeatureKey } from "../reducer/ingresos-list.reducer";

export const selectIngresosFeature = createFeatureSelector<EntidadListState<Ingreso>>(ingresosListFeatureKey);

export const selectIngresosList = createSelector(
    selectIngresosFeature,
    (state: EntidadListState<any>) => state.lista
);

export const selectLoading = createSelector(
    selectIngresosFeature,
    (state: EntidadListState<Ingreso>) => state.loading
);

export const selectErrorCarga = createSelector(
    selectIngresosFeature,
    (state: EntidadListState<Ingreso>) => state.errorCarga
);