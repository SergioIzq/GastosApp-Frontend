import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { GastoProgramado } from "src/app/shared/models/entidades/gastoProgramado.model";

export const selectGastosProgrmadosFeature = (state: AppState) => state.listaGastosProgramados

export const selectGastosList = createSelector(
    selectGastosProgrmadosFeature,
    (state: EntidadListState<any>) => state.lista
);

export const selectLoading = createSelector(
    selectGastosProgrmadosFeature,
    (state: EntidadListState<GastoProgramado>) => state.loading
);

export const selectErrorCarga = createSelector(
    selectGastosProgrmadosFeature,
    (state: EntidadListState<GastoProgramado>) => state.errorCarga
);