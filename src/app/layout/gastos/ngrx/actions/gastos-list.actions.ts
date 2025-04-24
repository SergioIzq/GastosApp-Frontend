import { createAction, props } from '@ngrx/store';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';
import { Gasto } from 'src/app/shared/models/entidades/gasto.model';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/responseData.model';

export const LoadingGastos = createAction('LoadingGastos', props<{ page: number, size: number, idUsuario:number }>());

export const LoadingGastosSuccess = createAction('LoadingGastosSuccess', props<{ listaGastos: ResponseData<Gasto> }>());

export const LoadingGastosFailure = createAction('LoadingGastosFailure', props<{errorMessage: string}>());

export const DeleteGasto = createAction('DeleteGasto', props<{ id: number }>());

export const DeleteGastoSuccess = createAction('DeleteGastoSuccess');

export const DeleteGastoFailure = createAction('DeleteGastoFailure', props<{ errorMessage: string }>());

export const CloseModal = createAction('CloseModal');

export const ExportExcelGasto = createAction(
    'ExportExcelGasto',
    props<{ res: Excel }>()
);

export const ExportExcelGastoSuccess = createAction(
    'ExportExcelGastoSuccess'
)

export const ExportExcelGastoFailure = createAction(
    'ExportExcelGastoFailure',
    props<{ errorMessage: string }>()
);