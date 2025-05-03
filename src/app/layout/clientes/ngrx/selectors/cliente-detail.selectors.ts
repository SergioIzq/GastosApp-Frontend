import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClienteDetailState } from 'src/app/shared/models/entidades/estados/clienteDetail.model';
import { clienteDetailFeaturekey } from '../reducers/cliente-detail.reducer';


export const selectClienteDetailFeature = createFeatureSelector<ClienteDetailState>(clienteDetailFeaturekey);

export const selectedClienteSelector = createSelector(
    selectClienteDetailFeature,
    (state: ClienteDetailState) => state.clientePorId
);

export const selectLoading = createSelector(
    selectClienteDetailFeature,
    (state: ClienteDetailState) => state.loading
);

export const selectErrorCarga = createSelector(
    selectClienteDetailFeature,
    (state: ClienteDetailState) => state.errorCarga
);
