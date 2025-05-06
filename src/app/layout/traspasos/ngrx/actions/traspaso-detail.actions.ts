import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { TraspasoByIdRespuesta } from 'src/app/shared/models/entidades/respuestas/traspasos/traspasoByIdRespuesta.model';
import { Traspaso } from 'src/app/shared/models/entidades/traspaso.model';

export const RealizarTraspaso = createAction('RealizarTraspaso', props<{ payload: Traspaso }>());

export const RealizarTraspasoSuccess = createAction('RealizarTraspasoSuccess', props<{ traspaso: TraspasoByIdRespuesta }>());

export const RealizarTraspasoFail = createAction('RealizarTraspasoFail', props<{ errorMessage: string }>());

export const UpdateTraspaso = createAction('UpdateTraspaso', props<{ traspaso: Partial<Traspaso> }>());

export const UpdateTraspasoFailure = createAction('UpdateTraspasoFailure', props<{ errorMessage: Observable<never> }>());

export const UpdateTraspasoSuccess = createAction('UpdateTraspasoSuccess', props<{ successMessage: string }>());

export const DeleteTraspaso = createAction('DeleteTraspaso', props<{ id: number }>());

export const DeleteTraspasoSuccess = createAction('DeleteTraspasoSuccess');

export const DeleteTraspasoFail = createAction('DeleteTraspasoFail');

export const GetTraspaso = createAction('GetTraspaso', props<{ id: number }>());

export const GetTraspasoSuccess = createAction('GetTraspasoSuccess', props<{ traspasoPorId: TraspasoByIdRespuesta }>());

export const GetTraspasoFailure = createAction('GetTraspasoFailure', props<{ errorMessage: Observable<never> }>());

export const GetNewTraspaso = createAction('GetNewTraspaso', props<{ payload: number }>());

export const GetNewTraspasoSuccess = createAction('GetNewTraspasoSuccess', props<{ payload: Cuenta[] }>());

export const GetNewTraspasoFail = createAction('GetNewTraspasoFail');