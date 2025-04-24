import { createAction, props } from '@ngrx/store';
import { Ingreso } from 'src/app/shared/models/entidades/ingreso.model';
import { IngresoByIdRespuesta } from 'src/app/shared/models/entidades/respuestas/ingresoByIdRespuesta.model';
import { IngresoRespuesta } from 'src/app/shared/models/entidades/respuestas/ingresoRespuesta.model';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/responseOne.model';


export const GetIngreso = createAction('GetIngreso', props<{ id: number }>());

export const GetIngresoSuccess = createAction('GetIngresoSuccess', props<{ ingreso: IngresoByIdRespuesta }>());

export const GetIngresoFail = createAction('GetIngresoFail', props<{errorMessage:string}>());

export const UpdateIngreso = createAction('UpdateIngreso', props<{ ingreso: Partial<Ingreso> }>());

export const UpdateIngresoFailure = createAction('UpdateIngresoFailure', props<{ errorMessage: string }>());

export const UpdateIngresoSuccess = createAction('UpdateIngresoSuccess', props<{ ingreso: Ingreso }>());

export const DeleteIngreso = createAction('DeleteIngreso', props<{ id: number }>());

export const DeleteIngresoSuccess = createAction('DeleteIngresoSuccess');

export const DeleteIngresoFail = createAction('DeleteIngresoFailD');

export const CreateIngreso = createAction('CreateIngreso', props<{ payload: Ingreso }>());

export const CreateIngresoSuccess = createAction('CreateIngresoSuccess', props<{ ingreso: ResponseOne<IngresoByIdRespuesta> }>());

export const CreateIngresoFailure = createAction('CreateIngresoFailure', props<{ errorMessage: string }>());

export const GetNewIngreso = createAction('GetNewIngreso', props<{ payload: number }>());

export const GetNewIngresoSuccess = createAction('GetNewIngresoSuccess', props<{ payload: IngresoRespuesta }>());

export const GetNewIngresoFail = createAction('GetNewIngresoFail');