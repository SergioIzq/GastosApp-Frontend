import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Persona } from "src/app/shared/models/entidades/persona.model";

export const selectPersonasFeature = (state: AppState) => state.listaPersonas

export const selectPersonasList = createSelector(
    selectPersonasFeature,
    (state: EntidadListState<any>) => state.lista
);

export const selectLoading = createSelector(
    selectPersonasFeature,
    (state: EntidadListState<Persona>) => state.loading
);

export const selectErrorCarga = createSelector(
    selectPersonasFeature,
    (state: EntidadListState<Persona>) => state.errorCarga
);

