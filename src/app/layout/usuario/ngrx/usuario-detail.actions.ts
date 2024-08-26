import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/shared/models/entidades/usuario.model';

export const UpdateUsuario = createAction('UpdateUsuario', props<{ usuario: Partial<Usuario> }>());

export const UpdateUsuarioFailure = createAction('UpdateUsuarioFailure', props<{ errorMessage: Observable<never> }>());

export const UpdateUsuarioSuccess = createAction('UpdateUsuarioSuccess', props<{ successMessage: string }>());

export const DeleteUsuario = createAction('DeleteUsuario', props<{ id: number }>());

export const DeleteUsuarioSuccess = createAction('DeleteUsuarioSuccess');

export const DeleteUsuarioFailure = createAction('DeleteUsuarioFailure', props<{ errorMessage: Observable<never> }>());
