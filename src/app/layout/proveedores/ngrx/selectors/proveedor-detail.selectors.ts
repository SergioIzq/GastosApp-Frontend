import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ProveedorDetailState } from 'src/app/shared/models/entidades/estados/proveedorDetailState.model';


export const selectProveedorDetailFeature = (state: AppState) => state.proveedorPorId;

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
