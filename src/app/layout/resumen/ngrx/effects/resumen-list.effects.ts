import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, mergeMap } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import * as ResumenListActions from 'src/app/layout/resumen/ngrx/actions/resumen-list.actions';
import { ResumenService } from '../../service/resumen.service';;
import { MessageService } from 'primeng/api';
import { ResumenIngresosResponse } from "src/app/shared/models/entidades/respuestas/resumen/resumenIngresosResponse.model";
import { ResumenGastosResponse } from "src/app/shared/models/entidades/respuestas/resumen/ResumenGastosResumen.model";

@Injectable()
export class ResumenListEffects {
  constructor(
    private actions$: Actions,
    private resumenService: ResumenService,
    private messageService: MessageService
  ) { }

  loadIngresos$ = createEffect(() => this.actions$.pipe(
    ofType(ResumenListActions.LoadIngresos),
    mergeMap(({ page, size, fechaInicio, fechaFin, idUsuario }) =>
      this.resumenService.getCantidadIngresos(page, size, fechaInicio, fechaFin, idUsuario).pipe(
        map((payload: ResumenIngresosResponse) => ResumenListActions.LoadIngresosSuccess({ payload })),
        catchError((error) => {
          return of(ResumenListActions.LoadIngresosFailure({ errorMessage: error }));
        })
      )
    )
  ));

  loadGastos$ = createEffect(() => this.actions$.pipe(
    ofType(ResumenListActions.LoadGastos),
    mergeMap(({ page, size, fechaInicio, fechaFin, idUsuario }) =>
      this.resumenService.getCantidadGastos(page, size, fechaInicio, fechaFin, idUsuario).pipe(
        map((payload: ResumenGastosResponse) => ResumenListActions.LoadGastosSuccess({ payload })),
        catchError((error) => {
          return of(ResumenListActions.LoadGastosFailure({ errorMessage: error }));
        })
      )
    )
  ));
}
