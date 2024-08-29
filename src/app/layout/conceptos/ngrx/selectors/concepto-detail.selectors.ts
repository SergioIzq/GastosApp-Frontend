import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ConceptoDetailState } from 'src/app/shared/models/entidades/estados/conceptoDetail.model';


export const selectConceptoDetailFeature = (state: AppState) => state.conceptoPorId;

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