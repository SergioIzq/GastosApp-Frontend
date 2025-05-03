import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProveedorDetailState } from 'src/app/shared/models/entidades/estados/proveedorDetailState.model';
import { proveedorFeatureKey } from '../reducers/proveedor-detail.reducer';

export const selectProveedorDetailFeature = createFeatureSelector<ProveedorDetailState>(proveedorFeatureKey);

export const selectedProveedorSelector = createSelector(
    selectProveedorDetailFeature,
    (state: ProveedorDetailState) => state.proveedorPorId
);

export const selectLoading = createSelector(
    selectProveedorDetailFeature,
    (state: ProveedorDetailState) => state.loading
);

export const selectErrorCarga = createSelector(
    selectProveedorDetailFeature,
    (state: ProveedorDetailState) => state.errorCarga
);
