import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap } from "rxjs";
import { CuentaService } from "../../service/cuentas.service";
import * as CuentaDetailActions from '../actions/cuenta-detail.actions';
import { Router } from "@angular/router";
import { BaseService } from "src/app/shared/service/base-service.service";
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ResponseOne } from "src/app/shared/models/entidades/responseOne.model";
import { Cuenta } from "src/app/shared/models/entidades/cuenta.model";

@Injectable()
export class CuentaDetailEffects extends BaseService {
  constructor(
    private actions$: Actions,
    private cuentaDetailService: CuentaService,
    private router: Router,
    messageService: MessageService,
    http: HttpClient
  ) {
    super(http, messageService);
  }

  getCuenta$ = createEffect(() => this.actions$.pipe(
    ofType(CuentaDetailActions.GetCuenta),
    mergeMap(({ id }) => this.cuentaDetailService.getById(id)
      .pipe(
        map(cuentaPorId => CuentaDetailActions.GetCuentaSuccess({ cuentaPorId })),
        catchError((error) => {
          return of(CuentaDetailActions.GetCuentaFail({ errorMessage: error }));
        })
      )
    )
  ));

  updateCuenta$ = createEffect(() => this.actions$.pipe(
    ofType(CuentaDetailActions.UpdateCuenta),
    mergeMap(({ cuenta }) => this.cuentaDetailService.update(cuenta)
      .pipe(
        map((response: any) => {
          const successMessage = response.message;
          this.handleSuccess(successMessage);
          return CuentaDetailActions.UpdateCuentaSuccess({ successMessage });
        }),
        catchError((error) => {
          return of(CuentaDetailActions.UpdateCuentaFailure({ errorMessage: error }));
        })
      )
    )
  ));

  createCuenta$ = createEffect(() => this.actions$.pipe(
    ofType(CuentaDetailActions.CreateCuenta),
    mergeMap(({ payload }) => this.cuentaDetailService.create(payload)
      .pipe(
        map((cuenta: ResponseOne<Cuenta>) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'Cuenta creada correctamente',
            life: 5000
          });

          return CuentaDetailActions.CreateCuentaSuccess({ cuenta });
        }),
        catchError((error) => {

          return of(CuentaDetailActions.CreateCuentaFailure({ errorMessage: error }));
        })
      )
    ))
  );

}
