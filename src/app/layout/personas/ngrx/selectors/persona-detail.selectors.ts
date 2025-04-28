import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PersonaDetailState } from 'src/app/shared/models/entidades/estados/personaDetail.model';
import { personaDetailFeatureKey } from '../reducers/persona-detail.reducer';


export const selectPersonaDetailFeature = createFeatureSelector<PersonaDetailState>(personaDetailFeatureKey);

export const selectedPersonaSelector = createSelector(
    selectPersonaDetailFeature,
    (state: PersonaDetailState) => state.personaPorId
);

export const selectLoading = createSelector(
    selectPersonaDetailFeature,
    (state: PersonaDetailState) => state.loading
);

export const selectErrorCarga = createSelector(
    selectPersonaDetailFeature,
    (state: PersonaDetailState) => state.errorCarga
);
