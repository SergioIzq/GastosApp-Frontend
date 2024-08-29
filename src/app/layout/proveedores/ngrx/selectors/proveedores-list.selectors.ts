import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Proveedor } from "src/app/shared/models/entidades/proveedor.model";

export const selectProveedoresFeature = (state: AppState) => state.listaProveedores

export const selectProveedoresList = createSelector(
    selectProveedoresFeature,
    (state: EntidadListState<any>) => state.lista
);

export const selectLoading = createSelector(
    selectProveedoresFeature,
    (state: EntidadListState<Proveedor>) => state.loading
);

export const selectErrorCarga = createSelector(
    selectProveedoresFeature,
    (state: EntidadListState<Proveedor>) => state.errorCarga
);

