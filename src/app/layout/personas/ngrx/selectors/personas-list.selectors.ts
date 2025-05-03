import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Persona } from "src/app/shared/models/entidades/persona.model";
import { personasListFeatureKey } from "../reducers/personas-list.reducer";

export const selectPersonasFeature = createFeatureSelector<EntidadListState<Persona>>(personasListFeatureKey);

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

