import { createAction, props } from '@ngrx/store';
import { Traspaso } from 'src/app/shared/models/entidades/traspaso.model';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';

export const LoadingTraspasos = createAction('LoadingTraspasos', props<{ page: number, size: number, idUsuario: number }>());

export const LoadingTraspasosSuccess = createAction('LoadingTraspasosSuccess', props<{ listaTraspasos: ResponseData<Traspaso> }>());

export const LoadingTraspasosFailure = createAction('LoadingTraspasosFailure', props<{ errorMessage: string }>());

export const DeleteTraspaso = createAction('DeleteTraspaso', props<{ id: number }>());

export const DeleteTraspasoSuccess = createAction('DeleteTraspasoSuccess');

export const DeleteTraspasoFailure = createAction('DeleteTraspasoFailure', props<{ errorMessage: string }>());

export const ExportExcelTraspaso = createAction(
    'ExportExcelTraspaso',
    props<{ res: Excel }>()
);

export const ExportExcelTraspasoSuccess = createAction(
    'ExportExcelTraspasoSuccess'
)

export const ExportExcelTraspasoFailure = createAction(
    'ExportExcelTraspasoFailure',
    props<{ errorMessage: string }>()
);