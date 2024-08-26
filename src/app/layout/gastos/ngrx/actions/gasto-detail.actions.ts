import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/shared/models/entidades/cliente.model';
import { Concepto } from 'src/app/shared/models/entidades/concepto.model';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { FormaPago } from 'src/app/shared/models/entidades/formaPago.model';
import { Gasto } from 'src/app/shared/models/entidades/gasto.model';
import { Persona } from 'src/app/shared/models/entidades/persona.model';
import { Proveedor } from 'src/app/shared/models/entidades/proveedor.model';
import { ResponseData } from 'src/app/shared/models/entidades/responseData.model';
import { ResponseOne } from 'src/app/shared/models/entidades/responseOne.model';


export const GetGasto = createAction('GetGasto', props<{ id: number }>());

export const GetGastoSuccess = createAction('GetGastoSuccess', props<{ gasto: Gasto }>());

export const GetGastoFail = createAction('GetGastoFail', props<{ errorMessage: string }>());

export const UpdateGasto = createAction('UpdateGasto', props<{ gasto: Partial<Gasto> }>());

export const UpdateGastoFailure = createAction('UpdateGastoFailure', props<{ errorMessage: string }>());

export const UpdateGastoSuccess = createAction('UpdateGastoSuccess', props<{ gasto: Gasto }>());

export const DeleteGasto = createAction('DeleteGasto', props<{ id: number }>());

export const DeleteGastoSuccess = createAction('DeleteGastoSuccess');

export const DeleteGastoFail = createAction('DeleteGastoFail');

export const CreateGasto = createAction('CreateGasto', props<{ payload: Gasto }>());

export const CreateGastoSuccess = createAction('CreateGastoSuccess', props<{ gasto: ResponseOne<Gasto> }>());

export const CreateGastoFailure = createAction('CreateGastoFailure', props<{ errorMessage: string }>());

export const GetNewGasto = createAction('GetNewGasto', props<{ payload: number }>());

export const GetNewGastoSuccess = createAction('GetNewGastoSuccess', props<{ payload: Gasto }>());

export const GetNewGastoFail = createAction('GetNewGastoFail');


export const GetCuentasGasto = createAction('GetCuentasGasto', props<{ idUsuario: number }>());

export const GetCuentasGastoSuccess = createAction('GetCuentasGastoSuccess', props<{ cuentas: ResponseData<Cuenta> }>());

export const GetCuentasGastoFailure = createAction('GetCuentasGastoFailure', props<{ errorMessage: Observable<never> }>());


export const GetPersonasGasto = createAction('GetPersonasGasto', props<{ idUsuario: number }>());

export const GetPersonasGastoSuccess = createAction('GetPersonasGastoSuccess', props<{ personas: ResponseData<Persona> }>());

export const GetPersonasGastoFailure = createAction('GetPersonasGastoFailure', props<{ errorMessage: Observable<never> }>());


export const GetFormasPagoGasto = createAction('GetFormasPagoGasto', props<{ idUsuario: number }>());

export const GetFormasPagoGastoSuccess = createAction('GetFormasPagoGastoSuccess', props<{ formasPago: ResponseData<FormaPago> }>());

export const GetFormasPagoGastoFailure = createAction('GetFormasPagoGastoFailure', props<{ errorMessage: Observable<never> }>());


export const GetProveedoresGasto = createAction('GetProveedoresGasto', props<{ idUsuario: number }>());

export const GetProveedoresGastoSuccess = createAction('GetProveedoresGastoSuccess', props<{ proveedores: ResponseData<Proveedor> }>());

export const GetProveedoresGastoFailure = createAction('GetProveedoresGastoFailure', props<{ errorMessage: Observable<never> }>());

export const GetConceptosGasto = createAction('GetConceptosGasto', props<{ idUsuario: number }>());

export const GetConceptosGastoSuccess = createAction('GetConceptosGastoSuccess', props<{ conceptos: ResponseData<Concepto> }>());

export const GetConceptosGastoFailure = createAction('GetConceptosGastoFailure', props<{ errorMessage: Observable<never> }>());