import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { CuentaDetailState } from '../../../../shared/models/entidades/estados/cuentaDetailState.model';


export const selectCuentaDetailFeature = (state: AppState) => state.cuentaPorId;

export const selectedCuentaSelector = createSelector(
    selectCuentaDetailFeature,
    (state: CuentaDetailState) => state.cuentaPorId
);

export const selectCargando = createSelector(
    selectCuentaDetailFeature,
    (state: CuentaDetailState) => state.cargando
);

export const selectErrorCarga = createSelector(
    selectCuentaDetailFeature,
    (state: CuentaDetailState) => state.errorCarga
);
