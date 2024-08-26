import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { FormaPagoDetailState } from 'src/app/shared/models/entidades/estados/formaPagoDetailState.model';


export const selectFormaPagoDetailFeature = (state: AppState) => state.formaPago;

export const selectedFormaPagoSelector = createSelector(
    selectFormaPagoDetailFeature,
    (state: FormaPagoDetailState) => state.formaPagoPorId
);

export const selectCargando = createSelector(
    selectFormaPagoDetailFeature,
    (state: FormaPagoDetailState) => state.cargando
);

export const selectErrorCarga = createSelector(
    selectFormaPagoDetailFeature,
    (state: FormaPagoDetailState) => state.errorCarga
);
