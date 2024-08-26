import { createAction, props } from '@ngrx/store';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';
import { Persona } from 'src/app/shared/models/entidades/persona.model';
import { ResponseData } from 'src/app/shared/models/entidades/responseData.model';

export const LoadingPersonas = createAction('LoadingPersonas', props<{ page: number, size: number, idUsuario: number }>());

export const LoadingPersonasSuccess = createAction('LoadingPersonasSuccess', props<{ listaPersonas: ResponseData<Persona> }>());

export const LoadingPersonasFailure = createAction('LoadingPersonasFailure', props<{ errorMessage: string }>());

export const DeletePersona = createAction('DeletePersona', props<{ id: number }>());

export const DeletePersonaSuccess = createAction('DeletePersonaSuccess');

export const DeletePersonaFailure = createAction('DeletePersonaFailure', props<{ errorMessage: string }>());

export const ExportExcelPersona = createAction(
    'ExportExcelPersona',
    props<{ res: Excel }>()
);

export const ExportExcelPersonaSuccess = createAction(
    'ExportExcelPersonaSuccess'
)

export const ExportExcelPersonaFailure = createAction(
    'ExportExcelPersonaFailure',
    props<{ errorMessage: string }>()
);