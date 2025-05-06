import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, mergeMap } from "rxjs";
import { map, catchError } from "rxjs/operators";
import * as IngresosProgramadosListActions from 'src/app/layout/ingresos/ngrx/actions/ingresos-programados-list.actions';
import { IngresoService } from '../../service/ingreso.service';
import { ResponseData } from '../../../../shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { MessageService } from 'primeng/api';
import { IngresoProgramado } from "src/app/shared/models/entidades/ingresoProgramado.model";

@Injectable()
export class IngresosProgramadosListEffects {
  constructor(
    private actions$: Actions,
    private ingresosService: IngresoService,
    private messageService: MessageService // Inyectamos el MessageService
  ) { }

  loadIngresos$ = createEffect(() => this.actions$.pipe(
    ofType(IngresosProgramadosListActions.LoadingIngresosProgramados),
    mergeMap(({ page, size, idUsuario }) =>
      this.ingresosService.getCantidadIngresosProgramados(page, size, idUsuario).pipe(
        map((listaIngresosProgramados: ResponseData<IngresoProgramado>) => IngresosProgramadosListActions.LoadingIngresosProgramadosSuccess({ listaIngresosProgramados })),
        catchError((error) => {
          return of(IngresosProgramadosListActions.LoadingIngresosProgramadosFailure({ errorMessage: error }));
        })
      )
    )
  ));

  deleteIngreso$ = createEffect(() => this.actions$.pipe(
    ofType(IngresosProgramadosListActions.DeleteIngresoProgramado),
    mergeMap((action) => this.ingresosService.deleteProgramado(action.id).pipe(
      map(() => {
        this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Ingreso programado eliminado correctamente', life: 5000 });
        return IngresosProgramadosListActions.DeleteIngresoProgramadoSuccess();
      }),
      catchError((error) => {
        return of(IngresosProgramadosListActions.DeleteIngresoProgramadoFailure({ errorMessage: error }));
      })
    ))
  ));

}
