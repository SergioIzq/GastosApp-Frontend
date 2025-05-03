import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/responseOne.model';
import { GastoProgramado } from '../../../../shared/models/entidades/gastoProgramado.model';
import { GastoProgramadoByIdRespuesta } from 'src/app/shared/models/entidades/respuestas/gastoProgramadoByIdRespuesta.model';
import { GastoRespuesta } from 'src/app/shared/models/entidades/respuestas/gastoRespuesta.model';


export const GetGastoProgramado = createAction('GetGastoProgramado', props<{ id: number }>());

export const GetGastoProgramadoSuccess = createAction('GetGastoProgramadoSuccess', props<{ gastoProgramado: GastoProgramadoByIdRespuesta }>());

export const GetGastoProgramadoFail = createAction('GetGastoProgramadoFail', props<{ errorMessage: string }>());

export const UpdateGastoProgramado = createAction('UpdateGastoProgramado', props<{ gastoProgramado: Partial<GastoProgramado> }>());

export const UpdateGastoProgramadoFailure = createAction('UpdateGastoProgramadoFailure', props<{ errorMessage: string }>());

export const UpdateGastoProgramadoSuccess = createAction('UpdateGastoProgramadoSuccess', props<{ gastoProgramado: GastoProgramado }>());

export const DeleteGastoProgramado = createAction('DeleteGastoProgramado', props<{ id: number }>());

export const DeleteGastoProgramadoSuccess = createAction('DeleteGastoProgramadoSuccess');

export const DeleteGastoProgramadoFail = createAction('DeleteGastoProgramadoFail');

export const CreateGastoProgramado = createAction('CreateGastoProgramado', props<{ payload: GastoProgramado }>());

export const CreateGastoProgramadoSuccess = createAction('CreateGastoProgramadoSuccess', props<{ gastoProgramado: ResponseOne<GastoProgramado> }>());

export const CreateGastoProgramadoFailure = createAction('CreateGastoProgramadoFailure', props<{ errorMessage: string }>());

export const GetNewGastoProgramado = createAction('GetNewGastoProgramado', props<{ payload: number }>());

export const GetNewGastoProgramadoSuccess = createAction('GetNewGastoProgramadoSuccess', props<{ payload: GastoRespuesta }>());

export const GetNewGastoProgramadoFail = createAction('GetNewGastoProgramadoFail', props<{ errorMessage: Observable<never> }>());