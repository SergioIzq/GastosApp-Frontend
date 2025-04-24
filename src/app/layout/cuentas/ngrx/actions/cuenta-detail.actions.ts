import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/responseOne.model';


export const GetCuenta = createAction('GetCuenta', props<{ id: number }>());

export const GetCuentaSuccess = createAction('GetCuentaSuccess', props<{ cuentaPorId: Cuenta }>());

export const GetCuentaFail = createAction('GetCuentaFail', props<{ errorMessage: Observable<never> }>());

export const UpdateCuenta = createAction('UpdateCuenta', props<{ cuenta: Partial<Cuenta> }>());

export const UpdateCuentaFailure = createAction('UpdateCuentaFailure', props<{ errorMessage: Observable<never> }>());

export const UpdateCuentaSuccess = createAction('UpdateCuentaSuccess', props<{ successMessage: string }>());

export const DeleteCuenta = createAction('DeleteCuenta', props<{ id: number }>());

export const DeleteCuentaSuccess = createAction('DeleteCuentaSuccess');

export const DeleteCuentaFail = createAction('DeleteCuentaFail');

export const CreateCuenta = createAction('CreateCuenta', props<{ payload: Cuenta }>());

export const CreateCuentaSuccess = createAction('CreateCuentaSuccess', props<{ cuenta: ResponseOne<Cuenta> }>());

export const CreateCuentaFailure = createAction('CreateCuentaFail', props<{ errorMessage: string }>());