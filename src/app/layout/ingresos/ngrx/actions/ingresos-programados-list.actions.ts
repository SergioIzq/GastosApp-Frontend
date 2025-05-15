import { createAction, props } from '@ngrx/store';
import { IngresoProgramado } from 'src/app/shared/models/entidades/ingresoProgramado.model';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';

export const LoadingIngresosProgramados = createAction('LoadingIngresoProgramados', props<{ page: number, size: number, idUsuario:number }>());

export const LoadingIngresosProgramadosSuccess = createAction('LoadingIngresoProgramadosSuccess', props<{ listaIngresosProgramados: ResponseData<IngresoProgramado> }>());

export const LoadingIngresosProgramadosFailure = createAction('LoadingIngresoProgramadosFailure', props<{errorMessage: string}>());

export const DeleteIngresoProgramado = createAction('DeleteIngresoProgramado', props<{ id: number }>());

export const DeleteIngresoProgramadoSuccess = createAction('DeleteIngresoProgramadoSuccess');

export const DeleteIngresoProgramadoFailure = createAction('DeleteIngresoProgramadoFailure', props<{ errorMessage: string }>());