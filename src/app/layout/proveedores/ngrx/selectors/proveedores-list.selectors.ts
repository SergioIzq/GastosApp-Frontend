import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Proveedor } from "src/app/shared/models/entidades/proveedor.model";
import { proveedoresListFeatureKey } from "../reducers/proveedores-list.reducer";

export const selectProveedoresFeature = createFeatureSelector<EntidadListState<Proveedor>>(proveedoresListFeatureKey);

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

