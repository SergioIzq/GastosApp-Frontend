import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Proveedor } from 'src/app/shared/models/entidades/proveedor.model';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseOne.model';


export const GetProveedor = createAction('GetProveedor', props<{ id: number }>());

export const GetProveedorSuccess = createAction('GetProveedorSuccess', props<{ proveedorPorId: Proveedor }>());

export const GetProveedorFail = createAction('GetProveedorFail', props<{ errorMessage: Observable<never> }>());

export const UpdateProveedor = createAction('UpdateProveedor', props<{ proveedor: Partial<Proveedor> }>());

export const UpdateProveedorFailure = createAction('UpdateProveedorFailure', props<{ errorMessage: Observable<never> }>());

export const UpdateProveedorSuccess = createAction('UpdateProveedorSuccess', props<{ successMessage: string }>());

export const DeleteProveedor = createAction('DeleteProveedor', props<{ id: number }>());

export const DeleteProveedorSuccess = createAction('DeleteProveedorSuccess');

export const DeleteProveedorFail = createAction('DeleteProveedorFail');

export const CreateProveedor = createAction('CreateProveedor', props<{ payload: Proveedor }>());

export const CreateProveedorSuccess = createAction('CreateProveedorSuccess', props<{ proveedor: ResponseOne<Proveedor> }>());

export const CreateProveedorFailure = createAction('CreateProveedorFailure', props<{ errorMessage: string }>());