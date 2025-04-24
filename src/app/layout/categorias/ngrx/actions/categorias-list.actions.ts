import { createAction, props } from '@ngrx/store';
import { Categoria } from 'src/app/shared/models/entidades/categoria.model';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/responseData.model';

export const LoadingCategorias = createAction('LoadingCategorias', props<{ page: number, size: number, idUsuario: number }>());

export const LoadingCategoriasSuccess = createAction('LoadingCategoriasSuccess', props<{ listaCategorias: ResponseData<Categoria> }>());

export const LoadingCategoriasFailure = createAction('LoadingCategoriasFailure', props<{ errorMessage: string }>());

export const DeleteCategoria = createAction('DeleteCategoria', props<{ id: number }>());

export const DeleteCategoriaSuccess = createAction('DeleteCategoriaSuccess');

export const DeleteCategoriaFailure = createAction('DeleteCategoriaFailure', props<{ errorMessage: string }>());

export const ExportExcelCategoria = createAction(
    'ExportExcelCategoria',
    props<{ res: Excel }>()
);

export const ExportExcelCategoriaSuccess = createAction(
    'ExportExcelCategoriaSuccess'
)

export const ExportExcelCategoriaFailure = createAction(
    'ExportExcelCategoriaFailure',
    props<{ errorMessage: string }>()
);