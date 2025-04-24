import { createAction, props } from '@ngrx/store';
import { Concepto } from 'src/app/shared/models/entidades/concepto.model';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/responseData.model';

export const LoadingConceptos = createAction('LoadingConceptos', props<{ page: number, size: number, idUsuario: number }>());

export const LoadingConceptosSuccess = createAction('LoadingConceptosSuccess', props<{ listaConceptos: ResponseData<Concepto> }>());

export const LoadingConceptosFailure = createAction('LoadingConceptosFailure', props<{ errorMessage: string }>());

export const DeleteConcepto = createAction('DeleteConcepto', props<{ id: number }>());

export const DeleteConceptoSuccess = createAction('DeleteConceptoSuccess');

export const DeleteConceptoFailure = createAction('DeleteConceptoFailure', props<{ errorMessage: string }>());
export const ExportExcelConcepto = createAction(
    'ExportExcelConcepto',
    props<{ res: Excel }>()
);

export const ExportExcelConceptoSuccess = createAction(
    'ExportExcelConceptoSuccess'
)

export const ExportExcelConceptoFailure = createAction(
    'ExportExcelConceptoFailure',
    props<{ errorMessage: string }>()
);