import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Cuenta } from "src/app/shared/models/entidades/cuenta.model";
import { cuentasListFeatureKey } from "../reducers/cuentas-list.reducer";

export const selectCuentasFeature = createFeatureSelector<EntidadListState<Cuenta>>(cuentasListFeatureKey);

export const selectCuentasList = createSelector(
    selectCuentasFeature,
    (state: EntidadListState<any>) => state.lista
);

export const selectLoading = createSelector(
    selectCuentasFeature,
    (state: EntidadListState<Cuenta>) => state.loading
);

export const selectErrorCarga = createSelector(
    selectCuentasFeature,
    (state: EntidadListState<Cuenta>) => state.errorCarga
);

