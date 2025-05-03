import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GastoProgramadoDetailState } from '../../../../shared/models/entidades/estados/gastoProgramadoDetailState.model';
import { gastoProgramadoDetailFeatureKey } from '../reducer/gasto-programado-detail.reducer';


export const selectGastoProgramadoDetailFeature = createFeatureSelector<GastoProgramadoDetailState>(gastoProgramadoDetailFeatureKey);

export const selectedGastoProgramadoSelector = createSelector(
    selectGastoProgramadoDetailFeature,
    (state: GastoProgramadoDetailState) => state.gastoProgramadoPorId
);

export const selectLoading = createSelector(
    selectGastoProgramadoDetailFeature,
    (state: GastoProgramadoDetailState) => state.loading
);

export const selectErrorCarga = createSelector(
    selectGastoProgramadoDetailFeature,
    (state: GastoProgramadoDetailState) => state.errorCarga
);

export const selectErrorMessage = createSelector(
    selectGastoProgramadoDetailFeature,
    (state: GastoProgramadoDetailState) => state.errorMessage
);

export const selectGastoRespuesta = createSelector(
    selectGastoProgramadoDetailFeature,
    (state: GastoProgramadoDetailState) => state.gastoRespuesta
);