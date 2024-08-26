import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Gasto } from "src/app/shared/models/entidades/gasto.model";

export const selectGastosFeature = (state: AppState) => state.listaGastos

export const selectGastosList = createSelector(
    selectGastosFeature,
    (state: EntidadListState<any>) => state.lista
);

export const selectCargando = createSelector(
    selectGastosFeature,
    (state: EntidadListState<Gasto>) => state.cargando
);

export const selectErrorCarga = createSelector(
    selectGastosFeature,
    (state: EntidadListState<Gasto>) => state.errorCarga
);