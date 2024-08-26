import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap } from "rxjs";
import { TraspasoService } from "../../service/traspaso.service";
import * as TraspasoDetailActions from '../actions/traspaso-detail.actions';
import { Router } from "@angular/router";
import { BaseService } from "src/app/shared/service/base-service.service";
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ResponseOne } from "src/app/shared/models/entidades/responseOne.model";
import { Traspaso } from "src/app/shared/models/entidades/traspaso.model";

@Injectable()
export class TraspasoDetailEffects extends BaseService {
  constructor(
    private actions$: Actions,
    private traspasoDetailService: TraspasoService,
    private router: Router,
    messageService: MessageService,
    http: HttpClient
  ) {
    super(http, messageService);
  }

  getTraspaso$ = createEffect(() => this.actions$.pipe(
    ofType(TraspasoDetailActions.GetTraspaso),
    mergeMap(({ id }) => this.traspasoDetailService.getById(id)
      .pipe(
        map(traspasoPorId => TraspasoDetailActions.GetTraspasoSuccess({ traspasoPorId })),
        catchError((error) => {
          return of(TraspasoDetailActions.GetTraspasoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  updateTraspaso$ = createEffect(() => this.actions$.pipe(
    ofType(TraspasoDetailActions.UpdateTraspaso),
    mergeMap(({ traspaso }) => this.traspasoDetailService.update(traspaso)
      .pipe(
        map((response: any) => {
          const successMessage = response.message;
          this.handleSuccess(successMessage);
          return TraspasoDetailActions.UpdateTraspasoSuccess({ successMessage });
        }),
        catchError((error) => {
          return of(TraspasoDetailActions.UpdateTraspasoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  realizarTraspaso$ = createEffect(() => this.actions$.pipe(
    ofType(TraspasoDetailActions.RealizarTraspaso),
    mergeMap(({ payload }) => this.traspasoDetailService.realizarTraspaso(payload)
      .pipe(
        map((traspaso: ResponseOne<Traspaso>) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'Traspaso creado correctamente',
            life: 5000
          });

          return TraspasoDetailActions.RealizarTraspasoSuccess({ traspaso });
        }),
        catchError((error) => {
          const errorMessage = this.getErrorMessage(error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
          });

          return of(TraspasoDetailActions.RealizarTraspasoFail({ errorMessage }));
        })
      )
    ))
  );

  getCuentas$ = createEffect(() => this.actions$.pipe(
    ofType(TraspasoDetailActions.GetCuentas),
    mergeMap(({ id }) => this.traspasoDetailService.getCuentas(id)
      .pipe(
        map(cuentas => TraspasoDetailActions.GetCuentasSuccess({ cuentas })),
        catchError((error) => {
          return of(TraspasoDetailActions.GetCuentasFailure({ errorMessage: error }));
        })
      )
    )
  ));

  // Método para obtener el mensaje de error
  private getErrorMessage(error: any): string {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
      }
    }
    return errorMessage;
  }
}
