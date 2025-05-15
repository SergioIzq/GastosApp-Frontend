import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Gasto } from 'src/app/shared/models/entidades/gasto.model';
import { GastoByIdRespuesta } from 'src/app/shared/models/entidades/respuestas/gastos/gastoByIdRespuesta.model';
import { GastoRespuesta } from 'src/app/shared/models/entidades/respuestas/gastos/gastoRespuesta.model';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseOne.model';


export const GetGasto = createAction('GetGasto', props<{ id: number }>());

export const GetGastoSuccess = createAction('GetGastoSuccess', props<{ gasto: GastoByIdRespuesta }>());

export const GetGastoFail = createAction('GetGastoFail', props<{ errorMessage: string }>());

export const UpdateGasto = createAction('UpdateGasto', props<{ gasto: Partial<Gasto> }>());

export const UpdateGastoFailure = createAction('UpdateGastoFailure', props<{ errorMessage: string }>());

export const UpdateGastoSuccess = createAction('UpdateGastoSuccess', props<{ gasto: Gasto }>());

export const DeleteGasto = createAction('DeleteGasto', props<{ id: number }>());

export const DeleteGastoSuccess = createAction('DeleteGastoSuccess');

export const DeleteGastoFail = createAction('DeleteGastoFail');

export const CreateGasto = createAction('CreateGasto', props<{ payload: Gasto }>());

export const CreateGastoSuccess = createAction('CreateGastoSuccess', props<{ gasto: ResponseOne<Gasto> }>());

export const CreateGastoFailure = createAction('CreateGastoFailure', props<{ errorMessage: string }>());

export const GetNewGasto = createAction('GetNewGasto', props<{ payload: number }>());

export const GetNewGastoSuccess = createAction('GetNewGastoSuccess', props<{ payload: GastoRespuesta }>());

export const GetNewGastoFail = createAction('GetNewGastoFail', props<{ errorMessage: Observable<never> }>());