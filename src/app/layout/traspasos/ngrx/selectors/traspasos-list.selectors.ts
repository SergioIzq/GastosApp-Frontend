import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Traspaso } from "src/app/shared/models/entidades/traspaso.model";

export const selectTraspasosFeature = (state: AppState) => state.listaTraspasos

export const selectTraspasosList = createSelector(
    selectTraspasosFeature,
    (state: EntidadListState<any>) => state.lista
);

export const selectLoading = createSelector(
    selectTraspasosFeature,
    (state: EntidadListState<Traspaso>) => state.loading
);

export const selectErrorCarga = createSelector(
    selectTraspasosFeature,
    (state: EntidadListState<Traspaso>) => state.errorCarga
);

