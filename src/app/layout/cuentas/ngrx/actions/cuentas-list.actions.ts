import { createAction, props } from '@ngrx/store';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';
import { ResponseData } from 'src/app/shared/models/entidades/responseData.model';

export const LoadingCuentas = createAction('LoadingCuentas', props<{ page: number, size: number, idUsuario: number }>());

export const LoadingCuentasSuccess = createAction('LoadingCuentasSuccess', props<{ listaCuentas: ResponseData<Cuenta> }>());

export const LoadingCuentasFailure = createAction('LoadingCuentasFailure', props<{ errorMessage: string }>());

export const DeleteCuenta = createAction('DeleteCuenta', props<{ id: number }>());

export const DeleteCuentaSuccess = createAction('DeleteCuentaSuccess');

export const DeleteCuentaFailure = createAction('DeleteCuentaFailure', props<{ errorMessage: string }>());

export const ExportExcelCuentas = createAction(
    'ExportExcelCuentas',
    props<{ res: Excel }>()
);

export const ExportExcelCuentasSuccess = createAction(
    'ExportExcelCuentasSuccess'
)

export const ExportExcelCuentasFailure = createAction(
    'ExportExcelCuentasFailure',
    props<{ errorMessage: string }>()
);