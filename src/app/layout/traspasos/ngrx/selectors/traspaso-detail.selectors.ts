import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { TraspasoDetailState } from 'src/app/shared/models/entidades/estados/traspasoDetail.model';


export const selectTraspasoDetailFeature = (state: AppState) => state.traspaso;

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