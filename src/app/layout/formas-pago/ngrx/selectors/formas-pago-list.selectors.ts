import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { FormaPago } from "src/app/shared/models/entidades/formaPago.model";
import { formasPagoListFeatureKey } from "../reducers/formas-pago-list.reducer";

export const selectFormasPagoFeature = createFeatureSelector<EntidadListState<FormaPago>>(formasPagoListFeatureKey);

export const selectFormasPagoList = createSelector(
    selectFormasPagoFeature,
    (state: EntidadListState<any>) => state.lista
);

export const selectLoading = createSelector(
    selectFormasPagoFeature,
    (state: EntidadListState<FormaPago>) => state.loading
);

export const selectErrorCarga = createSelector(
    selectFormasPagoFeature,
    (state: EntidadListState<FormaPago>) => state.errorCarga
);

