import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { IngresoDetailState } from '../../../../shared/models/entidades/estados/ingresoDetailState.model';


export const selectIngresoDetailFeature = (state: AppState) => state.ingresoPorId;

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