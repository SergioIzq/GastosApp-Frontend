import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TraspasoDetailState } from 'src/app/shared/models/entidades/estados/traspasoDetail.model';
import { traspasoDetailFeatureKey } from '../reducers/traspaso-detail.reducer';

export const selectTraspasoDetailFeature = createFeatureSelector<TraspasoDetailState>(traspasoDetailFeatureKey);

export const selectedTraspasoSelector = createSelector(
    selectTraspasoDetailFeature,
    (state: TraspasoDetailState) => state.traspasoPorId
);

export const selectLoading = createSelector(
    selectTraspasoDetailFeature,
    (state: TraspasoDetailState) => state.loading
);

export const selectErrorCarga = createSelector(
    selectTraspasoDetailFeature,
    (state: TraspasoDetailState) => state.errorCarga
);

export const selectCuentas = createSelector(
    selectTraspasoDetailFeature,
    (state: TraspasoDetailState) => state.cuentas
);