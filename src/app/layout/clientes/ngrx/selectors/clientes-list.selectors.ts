import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Cliente } from "src/app/shared/models/entidades/cliente.model";

export const selectClientesFeature = (state: AppState) => state.listaClientes

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

