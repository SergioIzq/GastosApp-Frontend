import { createAction, props } from '@ngrx/store';
import { TraspasoProgramado } from 'src/app/shared/models/entidades/traspasoProgramado.model';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';

export const LoadingTraspasosProgramados = createAction('LoadingTraspasoProgramados', props<{ page: number, size: number, idUsuario:number }>());

export const LoadingTraspasosProgramadosSuccess = createAction('LoadingTraspasoProgramadosSuccess', props<{ listaTraspasosProgramados: ResponseData<TraspasoProgramado> }>());

export const LoadingTraspasosProgramadosFailure = createAction('LoadingTraspasoProgramadosFailure', props<{errorMessage: string}>());

export const DeleteTraspasoProgramado = createAction('DeleteTraspasoProgramado', props<{ id: number }>());

export const DeleteTraspasoProgramadoSuccess = createAction('DeleteTraspasoProgramadoSuccess');

export const DeleteTraspasoProgramadoFailure = createAction('DeleteTraspasoProgramadoFailure', props<{ errorMessage: string }>());