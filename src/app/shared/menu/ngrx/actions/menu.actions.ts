import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/shared/models/entidades/usuario.model';

export const GetUsuario = createAction('GetUsuario', props<{ id: number }>());

export const GetUsuarioSuccess = createAction('GetUsuarioSuccess', props<{ usuarioPorId: Usuario }>());

export const GetUsuarioFail = createAction('GetUsuarioFail', props<{ errorMessage: Observable<never> }>());
