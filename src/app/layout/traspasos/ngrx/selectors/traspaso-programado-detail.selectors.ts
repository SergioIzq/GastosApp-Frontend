import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TraspasoProgramadoDetailState } from '../../../../shared/models/entidades/estados/traspasoProgramadoDetailState.model';
import { traspasoProgramadoDetailFeatureKey } from '../reducer/traspaso-programado-detail.reducer';

export const selectTraspasoProgramadoDetailFeature = createFeatureSelector<TraspasoProgramadoDetailState>(traspasoProgramadoDetailFeatureKey);

export const selectedTraspasoProgramadoSelector = createSelector(
    selectTraspasoProgramadoDetailFeature,
    (state: TraspasoProgramadoDetailState) => state.traspasoProgramadoPorId
);

export const selectLoading = createSelector(
    selectTraspasoProgramadoDetailFeature,
    (state: TraspasoProgramadoDetailState) => state.loading
);

export const selectErrorCarga = createSelector(
    selectTraspasoProgramadoDetailFeature,
    (state: TraspasoProgramadoDetailState) => state.errorCarga
);

export const selectErrorMessage = createSelector(
    selectTraspasoProgramadoDetailFeature,
    (state: TraspasoProgramadoDetailState) => state.errorMessage
);

export const selectTraspasoRespuesta = createSelector(
    selectTraspasoProgramadoDetailFeature,
    (state: TraspasoProgramadoDetailState) => state.cuentas
);