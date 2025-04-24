import { createAction, props } from '@ngrx/store';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';
import { Ingreso } from 'src/app/shared/models/entidades/ingreso.model';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/responseData.model';

export const LoadingIngresos = createAction('LoadingIngresos', props<{ page: number, size: number, idUsuario: number }>());

export const LoadingIngresosSuccess = createAction('LoadingIngresosSuccess', props<{ listaIngresos: ResponseData<Ingreso> }>());

export const LoadingIngresosFailure = createAction('LoadingIngresosFailure', props<{ errorMessage: string }>());

export const DeleteIngreso = createAction('DeleteIngreso', props<{ id: number }>());

export const DeleteIngresoSuccess = createAction('DeleteIngresoSuccess');

export const DeleteIngresoFailure = createAction('DeleteIngresoFailure', props<{ errorMessage: string }>());

export const CloseModal = createAction('CloseModal');

export const ExportExcelIngreso = createAction(
    'ExportExcelIngreso',
    props<{ res: Excel }>()
);

export const ExportExcelIngresoSuccess = createAction(
    'ExportExcelIngresoSuccess'
)

export const ExportExcelIngresoFailure = createAction(
    'ExportExcelIngresoFailure',
    props<{ errorMessage: string }>()
);