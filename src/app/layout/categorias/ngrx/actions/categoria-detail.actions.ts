import { createAction, props } from '@ngrx/store';
import { Categoria } from 'src/app/shared/models/entidades/categoria.model';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseOne.model';


export const GetCategoria = createAction('GetCategoria', props<{ id: number }>());

export const GetCategoriaSuccess = createAction('GetCategoriaSuccess', props<{ categoria: Categoria }>());

export const GetCategoriaFail = createAction('GetCategoriaFail', props<{ errorMessage: string }>());

export const UpdateCategoria = createAction('UpdateCategoria', props<{ categoria: Partial<Categoria> }>());

export const UpdateCategoriaFailure = createAction('UpdateCategoriaFailure', props<{ errorMessage: string }>());

export const UpdateCategoriaSuccess = createAction('UpdateCategoriaSuccess', props<{ categoria: Categoria }>());

export const DeleteCategoria = createAction('DeleteCategoria', props<{ id: number }>());

export const DeleteCategoriaSuccess = createAction('DeleteCategoriaSuccess');

export const DeleteCategoriaFail = createAction('DeleteCategoriaFailD');

export const CreateCategoria = createAction('CreateCategoria', props<{ payload: Categoria }>());

export const CreateCategoriaSuccess = createAction('CreateCategoriaSuccess', props<{ categoria: ResponseOne<Categoria> }>());

export const CreateCategoriaFailure = createAction('CreateCategoriaFailure', props<{ errorMessage: string }>());

export const GetNewCategoria = createAction('GetNewCategoria', props<{ payload: number }>());

export const GetNewCategoriaSuccess = createAction('GetNewCategoriaSuccess', props<{ payload: Categoria }>());

export const GetNewCategoriaFail = createAction('GetNewCategoriaFail');