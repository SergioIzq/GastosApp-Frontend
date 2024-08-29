import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Ingreso } from "src/app/shared/models/entidades/ingreso.model";

export const selectIngresosFeature = (state: AppState) => state.ingresos

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