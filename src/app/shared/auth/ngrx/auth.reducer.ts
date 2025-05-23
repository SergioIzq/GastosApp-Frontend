import { createReducer, on } from "@ngrx/store";
import { AuthState } from "src/app/shared/models/entidades/estados/authState.model";
import * as AuthActions from './auth.actions';

// Recuperar el token del almacenamiento local, si existe
const storedToken = localStorage.getItem('token');
const estadoInicial: AuthState = {
  token: storedToken ? storedToken : null,
  error: null,
  loading: false
};
export const authReducerFeatureKey = 'auth';

export const authReducer = createReducer(
  estadoInicial,
  on(AuthActions.login, state => ({
    ...state,
    loading: true
  })),
  on(AuthActions.loginSuccess, (state, { respuesta }) => {
    return {
      ...state,
      token: respuesta.token,
      loading: false,
      error: null
    };
  }),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error
  })),
  on(AuthActions.logout, (state) => {
    localStorage.removeItem('token');
    return {
      ...state,
      token: null,
      loading: false,
      error: null
    };
  }),
  on(AuthActions.signUp, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.signUpSuccess, (state) => {
    return {
      ...state,
      loading: false,
      error: null
    };
  }),
  on(AuthActions.signUpFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error
  }))
);

export function AuthReducer(state: AuthState = estadoInicial, action: any): AuthState {
  return authReducer(state, action);
}
