import { createAction, props } from '@ngrx/store';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';
import { FormaPago } from 'src/app/shared/models/entidades/formaPago.model';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';

export const LoadingFormasPago = createAction('LoadingFormasPago', props<{ page: number, size: number, idUsuario: number }>());

export const LoadingFormasPagoSuccess = createAction('LoadingFormasPagoSuccess', props<{ listaFormasPago: ResponseData<FormaPago> }>());

export const LoadingFormasPagoFailure = createAction('LoadingFormasPagoFailure', props<{ errorMessage: string }>());

export const DeleteFormaPago = createAction('DeleteFormaPago', props<{ id: number }>());

export const DeleteFormaPagoSuccess = createAction('DeleteFormaPagoSuccess');

export const DeleteFormaPagoFailure = createAction('DeleteFormaPagoFailure', props<{ errorMessage: string }>());

export const ExportExcelFormaPago = createAction(
    'ExportExcelFormaPago',
    props<{ res: Excel }>()
);

export const ExportExcelFormaPagoSuccess = createAction(
    'ExportExcelFormaPagoSuccess'
)

export const ExportExcelFormaPagoFailure = createAction(
    'ExportExcelFormaPagoFailure',
    props<{ errorMessage: string }>()
);