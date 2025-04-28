import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Cliente } from "src/app/shared/models/entidades/cliente.model";
import { clientesListFeatureKey } from "../reducers/clientes-list.reducer";

export const selectClientesFeature = createFeatureSelector<EntidadListState<Cliente>>(clientesListFeatureKey);

export const selectClientesList = createSelector(
    selectClientesFeature,
    (state: EntidadListState<any>) => state.lista
);

export const selectLoading = createSelector(
    selectClientesFeature,
    (state: EntidadListState<Cliente>) => state.loading
);

export const selectErrorCarga = createSelector(
    selectClientesFeature,
    (state: EntidadListState<Cliente>) => state.errorCarga
);

