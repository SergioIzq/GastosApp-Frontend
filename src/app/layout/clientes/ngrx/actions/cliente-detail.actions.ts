import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/shared/models/entidades/cliente.model';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseOne.model';


export const GetCliente = createAction('GetCliente', props<{ id: number }>());

export const GetClienteSuccess = createAction('GetClienteSuccess', props<{ clientePorId: Cliente }>());

export const GetClienteFail = createAction('GetClienteFail', props<{ errorMessage: Observable<never> }>());

export const UpdateCliente = createAction('UpdateCliente', props<{ cliente: Partial<Cliente> }>());

export const UpdateClienteFailure = createAction('UpdateClienteFailure', props<{ errorMessage: Observable<never> }>());

export const UpdateClienteSuccess = createAction('UpdateClienteSuccess', props<{ successMessage: string }>());

export const DeleteCliente = createAction('DeleteCliente', props<{ id: number }>());

export const DeleteClienteSuccess = createAction('DeleteClienteSuccess');

export const DeleteClienteFail = createAction('DeleteClienteFail');

export const CreateCliente = createAction('CreateCliente', props<{ payload: Cliente }>());

export const CreateClienteSuccess = createAction('CreateClienteSuccess', props<{ cliente: ResponseOne<Cliente> }>());

export const CreateClienteFailure = createAction('CreateClienteFail', props<{ errorMessage: string }>());