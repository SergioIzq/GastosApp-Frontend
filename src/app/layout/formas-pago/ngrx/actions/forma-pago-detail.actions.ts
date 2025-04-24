import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormaPago } from 'src/app/shared/models/entidades/formaPago.model';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/responseOne.model';


export const GetFormaPago = createAction('GetFormaPago', props<{ id: number }>());

export const GetFormaPagoSuccess = createAction('GetFormaPagoSuccess', props<{ formaPagoPorId: FormaPago }>());

export const GetFormaPagoFail = createAction('GetFormaPagoFail', props<{ errorMessage: Observable<never> }>());

export const UpdateFormaPago = createAction('UpdateFormaPago', props<{ formaPago: Partial<FormaPago> }>());

export const UpdateFormaPagoFailure = createAction('UpdateFormaPagoFailure', props<{ errorMessage: Observable<never> }>());

export const UpdateFormaPagoSuccess = createAction('UpdateFormaPagoSuccess', props<{ successMessage: string }>());

export const DeleteFormaPago = createAction('DeleteFormaPago', props<{ id: number }>());

export const DeleteFormaPagoSuccess = createAction('DeleteFormaPagoSuccess');

export const DeleteFormaPagoFail = createAction('DeleteFormaPagoFail');

export const CreateFormaPago = createAction('CreateFormaPago', props<{ payload: FormaPago }>());

export const CreateFormaPagoSuccess = createAction('CreateFormaPagoSuccess', props<{ formaPago: ResponseOne<FormaPago> }>());

export const CreateFormaPagoFailure = createAction('CreateFormaPagoFail', props<{ errorMessage: string }>());