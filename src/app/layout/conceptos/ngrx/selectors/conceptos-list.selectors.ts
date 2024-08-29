import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Concepto } from "src/app/shared/models/entidades/concepto.model";

export const selectConceptosFeature = (state: AppState) => state.listaConceptos

export const selectConceptosList = createSelector(
    selectConceptosFeature,
    (state: EntidadListState<any>) => state.lista
);

export const selectLoading = createSelector(
    selectConceptosFeature,
    (state: EntidadListState<Concepto>) => state.loading
);

export const selectErrorCarga = createSelector(
    selectConceptosFeature,
    (state: EntidadListState<Concepto>) => state.errorCarga
);

