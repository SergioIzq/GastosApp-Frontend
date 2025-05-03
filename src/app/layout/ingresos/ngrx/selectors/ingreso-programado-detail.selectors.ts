import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IngresoProgramadoDetailState } from '../../../../shared/models/entidades/estados/ingresoProgramadoDetailState.model';
import { ingresoProgramadoDetailFeatureKey } from '../reducer/ingreso-programado-detail.reducer';

export const selectIngresoProgramadoDetailFeature = createFeatureSelector<IngresoProgramadoDetailState>(ingresoProgramadoDetailFeatureKey);

export const selectedIngresoProgramadoSelector = createSelector(
    selectIngresoProgramadoDetailFeature,
    (state: IngresoProgramadoDetailState) => state.ingresoProgramadoPorId
);

export const selectLoading = createSelector(
    selectIngresoProgramadoDetailFeature,
    (state: IngresoProgramadoDetailState) => state.loading
);

export const selectErrorCarga = createSelector(
    selectIngresoProgramadoDetailFeature,
    (state: IngresoProgramadoDetailState) => state.errorCarga
);

export const selectErrorMessage = createSelector(
    selectIngresoProgramadoDetailFeature,
    (state: IngresoProgramadoDetailState) => state.errorMessage
);

export const selectIngresoRespuesta = createSelector(
    selectIngresoProgramadoDetailFeature,
    (state: IngresoProgramadoDetailState) => state.ingresoRespuesta
);