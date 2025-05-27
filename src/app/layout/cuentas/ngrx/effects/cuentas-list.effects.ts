import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, mergeMap } from "rxjs";
import { map, catchError } from "rxjs/operators";
import * as CuentasListActions from 'src/app/layout/cuentas/ngrx/actions/cuentas-list.actions';
import { CuentaService } from '../../service/cuentas.service';
import { ResponseData } from '../../../../shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { MessageService } from 'primeng/api';

@Injectable()
export class CuentasListEffects {
  constructor(
    private actions$: Actions,
    private cuentasService: CuentaService,
    private messageService: MessageService
  ) { }

  loadCuentas$ = createEffect(() => this.actions$.pipe(
    ofType(CuentasListActions.LoadingCuentas),
    mergeMap(({ page, size, idUsuario }) =>
      this.cuentasService.getCantidad(page, size, idUsuario).pipe(
        map((listaCuentas: ResponseData<Cuenta>) => CuentasListActions.LoadingCuentasSuccess({ listaCuentas })),
        catchError((error) => {
          return of(CuentasListActions.LoadingCuentasFailure({ errorMessage: error }));
        })
      )
    )
  ));

  deleteCuenta$ = createEffect(() => this.actions$.pipe(
    ofType(CuentasListActions.DeleteCuenta),
    mergeMap((action) => this.cuentasService.delete(action.id).pipe(
      map(() => {
        this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Cuenta eliminada correctamente', life: 5000 });
        return CuentasListActions.DeleteCuentaSuccess();
      }),
      catchError((error) => {
        return of(CuentasListActions.DeleteCuentaFailure({ errorMessage: error }));
      })
    ))
  ));
}
