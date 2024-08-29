import { createReducer, on } from "@ngrx/store";
import { PersonaDetailState } from "src/app/shared/models/entidades/estados/personaDetail.model";
import * as PersonaDetailActions from '../actions/persona-detail.actions'

export const estadoInicial: PersonaDetailState = { loading: false, personaPorId: null, errorCarga: false };

const personaDetailReducer = createReducer(
    estadoInicial,
    on(PersonaDetailActions.GetPersona, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
        createdSuccess: false
    })),
    on(PersonaDetailActions.GetPersonaSuccess, (state, { personaPorId }) => ({
        ...state,
        loading: false,
        personaPorId: personaPorId,
        errorCarga: false,
        createdSuccess: false
    })),
    on(PersonaDetailActions.GetPersonaFail, (state) => ({
        ...state,
        loading: false,
        personaPorId: null,
        errorCarga: true,
        createdSuccess: false
    })),

    on(PersonaDetailActions.CreatePersona, (state) => ({
        ...state,
        loading: true,
        createdSuccess: false
    })),
    on(PersonaDetailActions.CreatePersonaSuccess, (state, { persona }) => ({
        ...state,
        loading: false,
        createdSuccess: true,
        persona: persona
    })),
    on(PersonaDetailActions.CreatePersonaFailure, (state) => ({
        ...state,
        loading: false,
        persona: null,
        createdSuccess: false
    })),
    on(PersonaDetailActions.UpdatePersona, (state) => ({
        ...state,
        loading: true,
        createdSuccess: false
    })),
    on(PersonaDetailActions.UpdatePersonaSuccess, (state) => ({
        ...state,
        loading: false,
        createdSuccess: false
    })),
    on(PersonaDetailActions.UpdatePersonaFailure, (state, action) => ({
        ...state,
        loading: false,
        createdSuccess: false
    }))
);

export function PersonaDetailReducer(state: PersonaDetailState = estadoInicial, action: any): PersonaDetailState {
    return personaDetailReducer(state, action);
}
