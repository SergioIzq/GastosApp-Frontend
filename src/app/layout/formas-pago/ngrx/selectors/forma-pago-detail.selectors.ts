import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FormaPagoDetailState } from 'src/app/shared/models/entidades/estados/formaPagoDetailState.model';
import { formaPagoDetailFeatureKey } from '../reducers/forma-pago-detail.reducer';


export const selectFormaPagoDetailFeature = createFeatureSelector<FormaPagoDetailState>(formaPagoDetailFeatureKey);

export const selectedFormaPagoSelector = createSelector(
    selectFormaPagoDetailFeature,
    (state: FormaPagoDetailState) => state.formaPagoPorId
);

export const selectLoading = createSelector(
    selectFormaPagoDetailFeature,
    (state: FormaPagoDetailState) => state.loading
);

export const selectErrorCarga = createSelector(
    selectFormaPagoDetailFeature,
    (state: FormaPagoDetailState) => state.errorCarga
);
