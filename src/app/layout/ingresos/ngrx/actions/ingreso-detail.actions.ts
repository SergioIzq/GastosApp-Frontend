import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/shared/models/entidades/cliente.model';
import { Concepto } from 'src/app/shared/models/entidades/concepto.model';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { FormaPago } from 'src/app/shared/models/entidades/formaPago.model';
import { Ingreso } from 'src/app/shared/models/entidades/ingreso.model';
import { Persona } from 'src/app/shared/models/entidades/persona.model';
import { ResponseData } from 'src/app/shared/models/entidades/responseData.model';
import { ResponseOne } from 'src/app/shared/models/entidades/responseOne.model';


export const GetIngreso = createAction('GetIngreso', props<{ id: number }>());

export const GetIngresoSuccess = createAction('GetIngresoSuccess', props<{ ingreso: Ingreso }>());

export const GetIngresoFail = createAction('GetIngresoFail', props<{errorMessage:string}>());

export const UpdateIngreso = createAction('UpdateIngreso', props<{ ingreso: Partial<Ingreso> }>());

export const UpdateIngresoFailure = createAction('UpdateIngresoFailure', props<{ errorMessage: string }>());

export const UpdateIngresoSuccess = createAction('UpdateIngresoSuccess', props<{ ingreso: Ingreso }>());

export const DeleteIngreso = createAction('DeleteIngreso', props<{ id: number }>());

export const DeleteIngresoSuccess = createAction('DeleteIngresoSuccess');

export const DeleteIngresoFail = createAction('DeleteIngresoFailD');

export const CreateIngreso = createAction('CreateIngreso', props<{ payload: Ingreso }>());

export const CreateIngresoSuccess = createAction('CreateIngresoSuccess', props<{ ingreso: ResponseOne<Ingreso> }>());

export const CreateIngresoFailure = createAction('CreateIngresoFailure', props<{ errorMessage: string }>());

export const GetNewIngreso = createAction('GetNewIngreso', props<{ payload: number }>());

export const GetNewIngresoSuccess = createAction('GetNewIngresoSuccess', props<{ payload: Ingreso }>());

export const GetNewIngresoFail = createAction('GetNewIngresoFail');


export const GetCuentasIngreso = createAction('GetCuentasIngreso', props<{ idUsuario: number }>());

export const GetCuentasIngresoSuccess = createAction('GetCuentasIngresoSuccess', props<{ cuentas: ResponseData<Cuenta> }>());

export const GetCuentasIngresoFailure = createAction('GetCuentasIngresoFailure', props<{ errorMessage: Observable<never> }>());


export const GetPersonasIngreso = createAction('GetPersonasIngreso', props<{ idUsuario: number }>());

export const GetPersonasIngresoSuccess = createAction('GetPersonasIngresoSuccess', props<{ personas: ResponseData<Persona> }>());

export const GetPersonasIngresoFailure = createAction('GetPersonasIngresoFailure', props<{ errorMessage: Observable<never> }>());


export const GetFormasPagoIngreso = createAction('GetFormasPagoIngreso', props<{ idUsuario: number }>());

export const GetFormasPagoIngresoSuccess = createAction('GetFormasPagoIngresoSuccess', props<{ formasPago: ResponseData<FormaPago> }>());

export const GetFormasPagoIngresoFailure = createAction('GetFormasPagoIngresoFailure', props<{ errorMessage: Observable<never> }>());


export const GetClientesIngreso = createAction('GetClientesIngreso', props<{ idUsuario: number }>());

export const GetClientesIngresoSuccess = createAction('GetClientesIngresoSuccess', props<{ clientes: ResponseData<Cliente> }>());

export const GetClientesIngresoFailure = createAction('GetClientesIngresoFailure', props<{ errorMessage: Observable<never> }>());

export const GetConceptosIngreso = createAction('GetConceptosIngreso', props<{ idUsuario: number }>());

export const GetConceptosIngresoSuccess = createAction('GetConceptosIngresoSuccess', props<{ conceptos: ResponseData<Concepto> }>());

export const GetConceptosIngresoFailure = createAction('GetConceptosIngresoFailure', props<{ errorMessage: Observable<never> }>());