import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Categoria } from 'src/app/shared/models/entidades/categoria.model';
import { Concepto } from 'src/app/shared/models/entidades/concepto.model';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/responseData.model';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/responseOne.model';


export const GetConcepto = createAction('GetConcepto', props<{ id: number }>());

export const GetCategorias = createAction('GetCategorias', props<{ idUsuario: number }>());

export const GetCategoriasSuccess = createAction('GetCategoriasSuccess', props<{ categorias: ResponseData<Categoria> }>());

export const GetCategoriasFailure = createAction('GetCategoriasFailure', props<{ errorMessage: Observable<never> }>());

export const GetConceptoSuccess = createAction('GetConceptoSuccess', props<{ conceptoPorId: Concepto }>());

export const GetConceptoFail = createAction('GetConceptoFail', props<{ errorMessage: Observable<never> }>());

export const UpdateConcepto = createAction('UpdateConcepto', props<{ concepto: Partial<Concepto> }>());

export const UpdateConceptoFailure = createAction('UpdateConceptoFailure', props<{ errorMessage: Observable<never> }>());

export const UpdateConceptoSuccess = createAction('UpdateConceptoSuccess', props<{ successMessage: string }>());

export const DeleteConcepto = createAction('DeleteConcepto', props<{ id: number }>());

export const DeleteConceptoSuccess = createAction('DeleteConceptoSuccess');

export const DeleteConceptoFail = createAction('DeleteConceptoFail');

export const CreateConcepto = createAction('CreateConcepto', props<{ payload: Concepto }>());

export const CreateConceptoSuccess = createAction('CreateConceptoSuccess', props<{ concepto: ResponseOne<Concepto> }>());

export const CreateConceptoFailure = createAction('CreateConceptoFail', props<{ errorMessage: string }>());