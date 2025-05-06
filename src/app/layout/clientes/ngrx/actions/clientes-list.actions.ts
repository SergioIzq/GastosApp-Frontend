import { createAction, props } from '@ngrx/store';
import { Cliente } from 'src/app/shared/models/entidades/cliente.model';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';

export const LoadingClientes = createAction('LoadingClientes', props<{ page: number, size: number, idUsuario: number }>());

export const LoadingClientesSuccess = createAction('LoadingClientesSuccess', props<{ listaClientes: ResponseData<Cliente> }>());

export const LoadingClientesFailure = createAction('LoadingClientesFailure', props<{ errorMessage: string }>());

export const DeleteCliente = createAction('DeleteCliente', props<{ id: number }>());

export const DeleteClienteSuccess = createAction('DeleteClienteSuccess');

export const DeleteClienteFailure = createAction('DeleteClienteFailure', props<{ errorMessage: string }>());

export const ExportExcelClientes = createAction(
    'ExportExcelClientes',
    props<{ res: Excel }>()
);

export const ExportExcelClientesSuccess = createAction(
    'ExportExcelClientesSuccess'
)

export const ExportExcelClientesFailure = createAction(
    'ExportExcelClientesFailure',
    props<{ errorMessage: string }>()
);