import { createAction, props } from '@ngrx/store';

export const login = createAction('[Auth] Login', props<{ Correo: string; Contrasena: string }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ token: any }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const logout = createAction('[Auth] Logout');

// Define acciones para el registro de usuario
export const signUp = createAction(
    '[Auth] Sign Up',
    props<{ Correo: string; Contrasena: string }>()
);

export const signUpSuccess = createAction(
    '[Auth] Sign Up Success',
    props<{ token: any }>()
);

export const signUpFailure = createAction(
    '[Auth] Sign Up Failure',
    props<{ error: string }>()
);