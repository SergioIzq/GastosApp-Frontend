import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Cuenta } from "src/app/shared/models/entidades/cuenta.model";

export const selectCuentasFeature = (state: AppState) => state.listaCuentas

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

