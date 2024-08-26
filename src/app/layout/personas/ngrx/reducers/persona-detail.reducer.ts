import { createReducer, on } from "@ngrx/store";
import { PersonaDetailState } from "src/app/shared/models/entidades/estados/personaDetail.model";
import * as PersonaDetailActions from '../actions/persona-detail.actions'

export const estadoInicial: PersonaDetailState = { cargando: false, personaPorId: null, errorCarga: false };

const personaDetailReducer = createReducer(
    estadoInicial,
    on(PersonaDetailActions.GetPersona, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(PersonaDetailActions.GetPersonaSuccess, (state, { personaPorId }) => ({
        ...state,
        cargando: false,
        personaPorId: personaPorId,
        errorCarga: false,
        createdSuccess: false
    })),
    on(PersonaDetailActions.GetPersonaFail, (state) => ({
        ...state,
        cargando: false,
        personaPorId: null,
        errorCarga: true,
        createdSuccess: false
    })),

    on(PersonaDetailActions.CreatePersona, (state) => ({
        ...state,
        cargando: true,
        createdSuccess: false
    })),
    on(PersonaDetailActions.CreatePersonaSuccess, (state, { persona }) => ({
        ...state,
        cargando: false,
        createdSuccess: true,
        persona: persona
    })),
    on(PersonaDetailActions.CreatePersonaFailure, (state) => ({
        ...state,
        cargando: false,
        persona: null,
        createdSuccess: false
    })),
    on(PersonaDetailActions.UpdatePersona, (state) => ({
        ...state,
        cargando: true,
        createdSuccess: false
    })),
    on(PersonaDetailActions.UpdatePersonaSuccess, (state) => ({
        ...state,
        cargando: false,
        createdSuccess: false
    })),
    on(PersonaDetailActions.UpdatePersonaFailure, (state, action) => ({
        ...state,
        cargando: false,
        createdSuccess: false
    }))
);

export function PersonaDetailReducer(state: PersonaDetailState = estadoInicial, action: any): PersonaDetailState {
    return personaDetailReducer(state, action);
}
