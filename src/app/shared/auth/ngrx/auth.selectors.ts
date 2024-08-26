import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../models/entidades/estados/authState.model';
import { AppState } from 'src/app/app.state';
import { jwtDecode } from 'jwt-decode';

// Define the feature selector
export const selectAuthFeature = (state: AppState) => state.auth;

// Selector to get the token
export const selectAuthToken = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.token
);

// Selector to check if the authentication is loading
export const selectAuthLoading = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.loading
);

// Selector to get the authentication error
export const selectAuthError = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.error
);

// Selector to check if the user is authenticated
export const selectIsAuthenticated = createSelector(
  selectAuthFeature,
  (state: AuthState) => !!state.token
);

// Selector to get the user ID from the token
export const selectUserId = createSelector(
  selectAuthToken,
  (token: any) => {
    try {
      // Decodifica el token
      const decodedToken: any = jwtDecode(token);

      return decodedToken.sub;
    } catch (error) {
      return null;
    }
  }
);
