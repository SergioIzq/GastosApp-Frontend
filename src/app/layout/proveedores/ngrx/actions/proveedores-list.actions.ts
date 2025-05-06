import { createAction, props } from '@ngrx/store';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';
import { Proveedor } from 'src/app/shared/models/entidades/proveedor.model';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';

export const LoadingProveedores = createAction('LoadingProveedores', props<{ page: number, size: number, idUsuario: number }>());

export const LoadingProveedoresSuccess = createAction('LoadingProveedoresSuccess', props<{ listaProveedores: ResponseData<Proveedor> }>());

export const LoadingProveedoresFailure = createAction('LoadingProveedoresFailure', props<{ errorMessage: string }>());

export const DeleteProveedor = createAction('DeleteProveedor', props<{ id: number }>());

export const DeleteProveedorSuccess = createAction('DeleteProveedorSuccess');

export const DeleteProveedorFailure = createAction('DeleteProveedorFailure', props<{ errorMessage: string }>());

export const ExportExcelProveedores = createAction(
    'ExportExcelProveedores',
    props<{ res: Excel }>()
);

export const ExportExcelProveedoresSuccess = createAction(
    'ExportExcelProveedoresSuccess'
)

export const ExportExcelProveedoresFailure = createAction(
    'ExportExcelProveedoresFailure',
    props<{ errorMessage: string }>()
);