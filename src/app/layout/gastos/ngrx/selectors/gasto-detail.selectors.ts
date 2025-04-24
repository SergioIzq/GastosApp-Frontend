import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { GastoDetailState } from '../../../../shared/models/entidades/estados/gastoDetailState.model';


export const selectGastoDetailFeature = (state: AppState) => state.gastoPorId;

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