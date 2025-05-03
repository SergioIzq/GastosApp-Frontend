import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IngresoDetailState } from '../../../../shared/models/entidades/estados/ingresoDetailState.model';
import { ingresoDetailFeatureKey } from '../reducer/ingreso-detail.reducer';

export const selectIngresoDetailFeature = createFeatureSelector<IngresoDetailState>(ingresoDetailFeatureKey);

export const selectedIngresoSelector = createSelector(
    selectIngresoDetailFeature,
    (state: IngresoDetailState) => state.ingresoPorId
);

export const selectLoading = createSelector(
    selectIngresoDetailFeature,
    (state: IngresoDetailState) => state.loading
);

export const selectErrorCarga = createSelector(
    selectIngresoDetailFeature,
    (state: IngresoDetailState) => state.errorCarga
);

export const selectErrorMessage = createSelector(
    selectIngresoDetailFeature,
    (state: IngresoDetailState) => state.errorMessage
);