import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, mergeMap } from "rxjs";
import { map, catchError } from "rxjs/operators";
import * as GastosProgramadosListActions from 'src/app/layout/gastos/ngrx/actions/gastos-programados-list.actions';
import { GastoService } from '../../service/gasto.service';
import { ResponseData } from '../../../../shared/models/entidades/respuestas/responseData.model';
import { MessageService } from 'primeng/api';
import { GastoProgramado } from "src/app/shared/models/entidades/gastoProgramado.model";

@Injectable()
export class GastosProgramadosListEffects {
  constructor(
    private actions$: Actions,
    private gastosService: GastoService,
    private messageService: MessageService // Inyectamos el MessageService
  ) { }

  loadGastos$ = createEffect(() => this.actions$.pipe(
    ofType(GastosProgramadosListActions.LoadingGastosProgramados),
    mergeMap(({ page, size, idUsuario }) =>
      this.gastosService.getCantidadGastosProgramados(page, size, idUsuario).pipe(
        map((listaGastosProgramados: ResponseData<GastoProgramado>) => GastosProgramadosListActions.LoadingGastosProgramadosSuccess({ listaGastosProgramados })),
        catchError((error) => {
          return of(GastosProgramadosListActions.LoadingGastosProgramadosFailure({ errorMessage: error }));
        })
      )
    )
  ));

  deleteGasto$ = createEffect(() => this.actions$.pipe(
    ofType(GastosProgramadosListActions.DeleteGastoProgramado),
    mergeMap((action) => this.gastosService.deleteProgramado(action.id).pipe(
      map(() => {
        this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Gasto programado eliminado correctamente', life: 5000 });
        return GastosProgramadosListActions.DeleteGastoProgramadoSuccess();
      }),
      catchError((error) => {
        return of(GastosProgramadosListActions.DeleteGastoProgramadoFailure({ errorMessage: error }));
      })
    ))
  ));

}
