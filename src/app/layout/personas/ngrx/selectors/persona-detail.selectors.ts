import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { PersonaDetailState } from 'src/app/shared/models/entidades/estados/personaDetail.model';


export const selectPersonaDetailFeature = (state: AppState) => state.personaPorId;

export const selectedPersonaSelector = createSelector(
    selectPersonaDetailFeature,
    (state: PersonaDetailState) => state.personaPorId
);

export const selectCargando = createSelector(
    selectPersonaDetailFeature,
    (state: PersonaDetailState) => state.cargando
);

export const selectErrorCarga = createSelector(
    selectPersonaDetailFeature,
    (state: PersonaDetailState) => state.errorCarga
);
