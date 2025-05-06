import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseOne.model';
import { IngresoProgramado } from '../../../../shared/models/entidades/ingresoProgramado.model';
import { IngresoProgramadoByIdRespuesta } from 'src/app/shared/models/entidades/respuestas/ingresos/ingresoProgramadoByIdRespuesta.model';
import { IngresoRespuesta } from 'src/app/shared/models/entidades/respuestas/ingresos/ingresoRespuesta.model';

export const GetIngresoProgramado = createAction('GetIngresoProgramado', props<{ id: number }>());

export const GetIngresoProgramadoSuccess = createAction('GetIngresoProgramadoSuccess', props<{ ingresoProgramado: IngresoProgramadoByIdRespuesta }>());

export const GetIngresoProgramadoFail = createAction('GetIngresoProgramadoFail', props<{ errorMessage: string }>());

export const UpdateIngresoProgramado = createAction('UpdateIngresoProgramado', props<{ ingresoProgramado: Partial<IngresoProgramado> }>());

export const UpdateIngresoProgramadoFailure = createAction('UpdateIngresoProgramadoFailure', props<{ errorMessage: string }>());

export const UpdateIngresoProgramadoSuccess = createAction('UpdateIngresoProgramadoSuccess', props<{ ingresoProgramado: IngresoProgramado }>());

export const DeleteIngresoProgramado = createAction('DeleteIngresoProgramado', props<{ id: number }>());

export const DeleteIngresoProgramadoSuccess = createAction('DeleteIngresoProgramadoSuccess');

export const DeleteIngresoProgramadoFail = createAction('DeleteIngresoProgramadoFail');

export const CreateIngresoProgramado = createAction('CreateIngresoProgramado', props<{ payload: IngresoProgramado }>());

export const CreateIngresoProgramadoSuccess = createAction('CreateIngresoProgramadoSuccess', props<{ ingresoProgramado: ResponseOne<IngresoProgramado> }>());

export const CreateIngresoProgramadoFailure = createAction('CreateIngresoProgramadoFailure', props<{ errorMessage: string }>());

export const GetNewIngresoProgramado = createAction('GetNewIngresoProgramado', props<{ payload: number }>());

export const GetNewIngresoProgramadoSuccess = createAction('GetNewIngresoProgramadoSuccess', props<{ payload: IngresoRespuesta }>());

export const GetNewIngresoProgramadoFail = createAction('GetNewIngresoProgramadoFail', props<{ errorMessage: Observable<never> }>());