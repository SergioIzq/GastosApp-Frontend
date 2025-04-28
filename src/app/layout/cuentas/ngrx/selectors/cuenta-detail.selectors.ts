import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CuentaDetailState } from '../../../../shared/models/entidades/estados/cuentaDetailState.model';
import { cuentaDetailFeatureKey } from '../reducers/cuenta-detail.reducer';


export const selectCuentaDetailFeature = createFeatureSelector<CuentaDetailState>(cuentaDetailFeatureKey);

export const selectedCuentaSelector = createSelector(
    selectCuentaDetailFeature,
    (state: CuentaDetailState) => state.cuentaPorId
);

export const selectLoading = createSelector(
    selectCuentaDetailFeature,
    (state: CuentaDetailState) => state.loading
);

export const selectErrorCarga = createSelector(
    selectCuentaDetailFeature,
    (state: CuentaDetailState) => state.errorCarga
);
