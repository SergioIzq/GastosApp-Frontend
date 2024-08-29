import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { FormaPago } from "src/app/shared/models/entidades/formaPago.model";

export const selectFormasPagoFeature = (state: AppState) => state.listaFormasPago

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

