import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Persona } from 'src/app/shared/models/entidades/persona.model';
import { ResponseOne } from 'src/app/shared/models/entidades/responseOne.model';


export const GetPersona = createAction('GetPersona', props<{ id: number }>());

export const GetPersonaSuccess = createAction('GetPersonaSuccess', props<{ personaPorId: Persona }>());

export const GetPersonaFail = createAction('GetPersonaFail', props<{ errorMessage: Observable<never> }>());

export const UpdatePersona = createAction('UpdatePersona', props<{ persona: Partial<Persona> }>());

export const UpdatePersonaFailure = createAction('UpdatePersonaFailure', props<{ errorMessage: Observable<never> }>());

export const UpdatePersonaSuccess = createAction('UpdatePersonaSuccess', props<{ successMessage: string }>());

export const DeletePersona = createAction('DeletePersona', props<{ id: number }>());

export const DeletePersonaSuccess = createAction('DeletePersonaSuccess');

export const DeletePersonaFail = createAction('DeletePersonaFail');

export const CreatePersona = createAction('CreatePersona', props<{ payload: Persona }>());

export const CreatePersonaSuccess = createAction('CreatePersonaSuccess', props<{ persona: ResponseOne<Persona> }>());

export const CreatePersonaFailure = createAction('CreatePersonaFail', props<{ errorMessage: string }>());