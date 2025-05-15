import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseOne.model';
import { TraspasoProgramado } from '../../../../shared/models/entidades/traspasoProgramado.model';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { TraspasoProgramadoByIdRespuesta } from 'src/app/shared/models/entidades/respuestas/traspasos/traspasoProgramadoByIdRespuesta.model';

export const GetTraspasoProgramado = createAction('GetTraspasoProgramado', props<{ id: number }>());

export const GetTraspasoProgramadoSuccess = createAction('GetTraspasoProgramadoSuccess', props<{ traspasoProgramado: TraspasoProgramadoByIdRespuesta }>());

export const GetTraspasoProgramadoFail = createAction('GetTraspasoProgramadoFail', props<{ errorMessage: string }>());

export const UpdateTraspasoProgramado = createAction('UpdateTraspasoProgramado', props<{ traspasoProgramado: Partial<TraspasoProgramado> }>());

export const UpdateTraspasoProgramadoFailure = createAction('UpdateTraspasoProgramadoFailure', props<{ errorMessage: string }>());

export const UpdateTraspasoProgramadoSuccess = createAction('UpdateTraspasoProgramadoSuccess', props<{ traspasoProgramado: TraspasoProgramado }>());

export const DeleteTraspasoProgramado = createAction('DeleteTraspasoProgramado', props<{ id: number }>());

export const DeleteTraspasoProgramadoSuccess = createAction('DeleteTraspasoProgramadoSuccess');

export const DeleteTraspasoProgramadoFail = createAction('DeleteTraspasoProgramadoFail');

export const CreateTraspasoProgramado = createAction('CreateTraspasoProgramado', props<{ payload: TraspasoProgramado }>());

export const CreateTraspasoProgramadoSuccess = createAction('CreateTraspasoProgramadoSuccess', props<{ traspasoProgramado: ResponseOne<TraspasoProgramado> }>());

export const CreateTraspasoProgramadoFailure = createAction('CreateTraspasoProgramadoFailure', props<{ errorMessage: string }>());

export const GetNewTraspasoProgramado = createAction('GetNewTraspasoProgramado', props<{ payload: number }>());

export const GetNewTraspasoProgramadoSuccess = createAction('GetNewTraspasoProgramadoSuccess', props<{ payload: Cuenta[] }>());

export const GetNewTraspasoProgramadoFail = createAction('GetNewTraspasoProgramadoFail', props<{ errorMessage: Observable<never> }>());