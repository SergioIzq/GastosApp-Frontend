import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GastoDetailState } from '../../../../shared/models/entidades/estados/gastoDetailState.model';
import { gastoDetailFeatureKey } from '../reducer/gasto-detail.reducer';


export const selectGastoDetailFeature = createFeatureSelector<GastoDetailState>(gastoDetailFeatureKey);

export const selectedGastoSelector = createSelector(
    selectGastoDetailFeature,
    (state: GastoDetailState) => state.gastoPorId
);

export const selectLoading = createSelector(
    selectGastoDetailFeature,
    (state: GastoDetailState) => state.loading
);

export const selectErrorCarga = createSelector(
    selectGastoDetailFeature,
    (state: GastoDetailState) => state.errorCarga
);

export const selectErrorMessage = createSelector(
    selectGastoDetailFeature,
    (state: GastoDetailState) => state.errorMessage
);

export const selectGastoRespuesta = createSelector(
    selectGastoDetailFeature,
    (state: GastoDetailState) => state.gastoRespuesta
);