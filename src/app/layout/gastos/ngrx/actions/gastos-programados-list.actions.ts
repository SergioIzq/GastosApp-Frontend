import { createAction, props } from '@ngrx/store';
import { GastoProgramado } from 'src/app/shared/models/entidades/gastoProgramado.model';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';

export const LoadingGastosProgramados = createAction('LoadingGastoProgramados', props<{ page: number, size: number, idUsuario:number }>());

export const LoadingGastosProgramadosSuccess = createAction('LoadingGastoProgramadosSuccess', props<{ listaGastosProgramados: ResponseData<GastoProgramado> }>());

export const LoadingGastosProgramadosFailure = createAction('LoadingGastoProgramadosFailure', props<{errorMessage: string}>());

export const DeleteGastoProgramado = createAction('DeleteGastoProgramado', props<{ id: number }>());

export const DeleteGastoProgramadoSuccess = createAction('DeleteGastoProgramadoSuccess');

export const DeleteGastoProgramadoFailure = createAction('DeleteGastoProgramadoFailure', props<{ errorMessage: string }>());