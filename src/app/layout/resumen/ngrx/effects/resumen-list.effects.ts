import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, mergeMap } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import * as ResumenListActions from 'src/app/layout/resumen/ngrx/actions/resumen-list.actions';
import { ResumenService } from '../../service/resumen.service';;
import { MessageService } from 'primeng/api';
import { ResumenIngresosResponse } from "src/app/shared/models/entidades/resumenIngresosResponse.model";
import { ResumenGastosResponse } from "src/app/shared/models/entidades/ResumenGastosResumen.model";

@Injectable()
export class ResumenListEffects {
  constructor(
    private actions$: Actions,
    private resumenService: ResumenService,
    private messageService: MessageService
  ) { }

  loadIngresos$ = createEffect(() => this.actions$.pipe(
    ofType(ResumenListActions.LoadIngresos),
    mergeMap(({ page, size, fechaInicio, fechaFin }) =>
      this.resumenService.getCantidadIngresos(page, size, fechaInicio, fechaFin).pipe(
        map((payload: ResumenIngresosResponse) => ResumenListActions.LoadIngresosSuccess({ payload })),
        catchError((error) => {
          return of(ResumenListActions.LoadIngresosFailure({ errorMessage: error }));
        })
      )
    )
  ));

  loadGastos$ = createEffect(() => this.actions$.pipe(
    ofType(ResumenListActions.LoadGastos),
    mergeMap(({ page, size, fechaInicio, fechaFin }) =>
      this.resumenService.getCantidadGastos(page, size, fechaInicio, fechaFin).pipe(
        map((payload: ResumenGastosResponse) => ResumenListActions.LoadGastosSuccess({ payload })),
        catchError((error) => {
          return of(ResumenListActions.LoadGastosFailure({ errorMessage: error }));
        })
      )
    )
  ));

  exportExcel$ = createEffect(() => this.actions$.pipe(
    ofType(ResumenListActions.ExportExcel),
    mergeMap(({ datos, dirPath }) =>
      this.resumenService.exportExcel(datos, dirPath).pipe(
        // Acción en caso de éxito
        tap(() => {
          // Mostrar mensaje de éxito
          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'Los datos se han exportado a Excel correctamente.',
            life: 5000
          });
        }),
        map(() => ResumenListActions.ExportExcelSuccess()),
        catchError((error) => {
          return of(ResumenListActions.ExportExcelFailure({ errorMessage: error }));
        })
      )
    )
  ));

}
