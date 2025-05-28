import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, mergeMap } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import * as GastosListActions from 'src/app/layout/gastos/ngrx/actions/gastos-list.actions';
import { GastoService } from '../../service/gasto.service';
import { ResponseData } from '../../../../shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { Gasto } from 'src/app/shared/models/entidades/gasto.model';
import { MessageService } from 'primeng/api';

@Injectable()
export class GastosListEffects {
  constructor(
    private actions$: Actions,
    private gastosService: GastoService,
    private messageService: MessageService // Inyectamos el MessageService
  ) { }

  loadGastos$ = createEffect(() => this.actions$.pipe(
    ofType(GastosListActions.LoadingGastos),
    mergeMap(({ page, size, idUsuario }) =>
      this.gastosService.getCantidad(page, size, idUsuario).pipe(
        map((listaGastos: ResponseData<Gasto>) => GastosListActions.LoadingGastosSuccess({ listaGastos })),
        catchError((error) => {
          return of(GastosListActions.LoadingGastosFailure({ errorMessage: error }));
        })
      )
    )
  ));

  deleteGasto$ = createEffect(() => this.actions$.pipe(
    ofType(GastosListActions.DeleteGasto),
    mergeMap((action) => this.gastosService.delete(action.id).pipe(
      map(() => {
        this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Gasto eliminado correctamente', life: 5000 });
        return GastosListActions.DeleteGastoSuccess();
      }),
      catchError((error) => {
        return of(GastosListActions.DeleteGastoFailure({ errorMessage: error }));
      })
    ))
  ));

}
