import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/responseData.model';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/responseOne.model';
import { Traspaso } from 'src/app/shared/models/entidades/traspaso.model';

export const RealizarTraspaso = createAction('RealizarTraspaso', props<{ payload: Traspaso }>());

export const RealizarTraspasoSuccess = createAction('RealizarTraspasoSuccess', props<{ traspaso: ResponseOne<Traspaso> }>());

export const RealizarTraspasoFail = createAction('RealizarTraspasoFail', props<{ errorMessage: string }>());

export const GetCuentas = createAction('GetCuentas', props<{ id: number }>());

export const GetCuentasSuccess = createAction('GetCuentasSuccess', props<{ cuentas: ResponseData<Cuenta> }>());

export const GetCuentasFailure = createAction('GetCuentasFailure', props<{ errorMessage: Observable<never> }>());

export const UpdateTraspaso = createAction('UpdateTraspaso', props<{ traspaso: Partial<Traspaso> }>());

export const UpdateTraspasoFailure = createAction('UpdateTraspasoFailure', props<{ errorMessage: Observable<never> }>());

export const UpdateTraspasoSuccess = createAction('UpdateTraspasoSuccess', props<{ successMessage: string }>());

export const DeleteTraspaso = createAction('DeleteTraspaso', props<{ id: number }>());

export const DeleteTraspasoSuccess = createAction('DeleteTraspasoSuccess');

export const DeleteTraspasoFail = createAction('DeleteTraspasoFail');

export const GetTraspaso = createAction('GetTraspaso', props<{ id: number }>());

export const GetTraspasoSuccess = createAction('GetTraspasoSuccess', props<{ traspasoPorId: Traspaso }>());

export const GetTraspasoFailure = createAction('GetTraspasoFailure', props<{ errorMessage: Observable<never> }>());