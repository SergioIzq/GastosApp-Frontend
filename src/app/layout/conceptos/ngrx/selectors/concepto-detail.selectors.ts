import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConceptoDetailState } from 'src/app/shared/models/entidades/estados/conceptoDetail.model';
import { conceptoDetailFeatureKey } from '../reducers/concepto-detail.reducer';


export const selectConceptoDetailFeature = createFeatureSelector<ConceptoDetailState>(conceptoDetailFeatureKey);

export const selectedConceptoSelector = createSelector(
    selectConceptoDetailFeature,
    (state: ConceptoDetailState) => state.conceptoPorId
);

export const selectLoading = createSelector(
    selectConceptoDetailFeature,
    (state: ConceptoDetailState) => state.loading
);

export const selectErrorCarga = createSelector(
    selectConceptoDetailFeature,
    (state: ConceptoDetailState) => state.errorCarga
);

export const selectCategorias = createSelector(
    selectConceptoDetailFeature,
    (state: ConceptoDetailState) => state.categorias
);