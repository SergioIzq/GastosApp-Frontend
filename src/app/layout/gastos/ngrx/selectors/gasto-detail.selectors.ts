import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { GastoDetailState } from '../../../../shared/models/entidades/estados/gastoDetailState.model';


export const selectGastoDetailFeature = (state: AppState) => state.gastoPorId;

export const selectedGastoSelector = createSelector(
    selectGastoDetailFeature,
    (state: GastoDetailState) => state.gastoPorId
);

export const selectCargando = createSelector(
    selectGastoDetailFeature,
    (state: GastoDetailState) => state.cargando
);

export const selectErrorCarga = createSelector(
    selectGastoDetailFeature,
    (state: GastoDetailState) => state.errorCarga
);

export const selectErrorMessage = createSelector(
    selectGastoDetailFeature,
    (state: GastoDetailState) => state.errorMessage
);

export const selectCuentas = createSelector(
    selectGastoDetailFeature,
    (state: GastoDetailState) => state.cuentas
);

export const selectProveedores = createSelector(
    selectGastoDetailFeature,
    (state: GastoDetailState) => state.proveedores
);

export const selectFormasPago = createSelector(
    selectGastoDetailFeature,
    (state: GastoDetailState) => state.formasPago
);

export const selectConceptos = createSelector(
    selectGastoDetailFeature,
    (state: GastoDetailState) => state.conceptos
);

export const selectPersonas = createSelector(
    selectGastoDetailFeature,
    (state: GastoDetailState) => state.personas
);