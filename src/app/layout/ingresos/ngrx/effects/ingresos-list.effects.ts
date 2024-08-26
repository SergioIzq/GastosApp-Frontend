import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, mergeMap } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import * as IngresosListActions from 'src/app/layout/ingresos/ngrx/actions/ingresos-list.actions';
import { IngresoService } from '../../service/ingreso.service';
import { ResponseData } from '../../../../shared/models/entidades/responseData.model';
import { Ingreso } from 'src/app/shared/models/entidades/ingreso.model';
import { MessageService } from 'primeng/api';

@Injectable()
export class IngresosListEffects {
  constructor(
    private actions$: Actions,
    private ingresosService: IngresoService,
    private messageService: MessageService // Inyectamos el MessageService
  ) { }

  loadIngresos$ = createEffect(() => this.actions$.pipe(
    ofType(IngresosListActions.LoadingIngresos),
    mergeMap(({ page, size, idUsuario }) =>
      this.ingresosService.getCantidad(page, size, idUsuario).pipe(
        map((listaIngresos: ResponseData<Ingreso>) => IngresosListActions.LoadingIngresosSuccess({ listaIngresos })),
        catchError((error) => {
          return of(IngresosListActions.LoadingIngresosFailure({ errorMessage: error }));
        })
      )
    )
  ));

  deleteIngreso$ = createEffect(() => this.actions$.pipe(
    ofType(IngresosListActions.DeleteIngreso),
    mergeMap((action) => this.ingresosService.delete(action.id).pipe(
      map(() => {
        this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Ingreso eliminado correctamente', life: 5000 });
        return IngresosListActions.DeleteIngresoSuccess();
      }),
      catchError((error) => {
        return of(IngresosListActions.DeleteIngresoFailure({ errorMessage: error }));
      })
    ))
  ));

  exportExcel$ = createEffect(() => this.actions$.pipe(
    ofType(IngresosListActions.ExportExcelIngreso),
    mergeMap(({ res }) =>
      this.ingresosService.exportExcel(res).pipe(
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
        map(() => IngresosListActions.ExportExcelIngresoSuccess()),
        catchError((error) => {
          return of(IngresosListActions.ExportExcelIngresoFailure({ errorMessage: error }));
        })
      )
    )
  ));
}
