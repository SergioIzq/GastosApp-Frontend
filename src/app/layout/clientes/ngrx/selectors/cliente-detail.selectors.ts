import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ClienteDetailState } from 'src/app/shared/models/entidades/estados/clienteDetail.model';


export const selectClienteDetailFeature = (state: AppState) => state.clientePorId;

export const selectedClienteSelector = createSelector(
    selectClienteDetailFeature,
    (state: ClienteDetailState) => state.clientePorId
);

export const selectCargando = createSelector(
    selectClienteDetailFeature,
    (state: ClienteDetailState) => state.cargando
);

export const selectErrorCarga = createSelector(
    selectClienteDetailFeature,
    (state: ClienteDetailState) => state.errorCarga
);
