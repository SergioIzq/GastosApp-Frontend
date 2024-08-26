import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap } from "rxjs";
import { FormasPagoService } from "../../service/formas-pago.service";
import * as FormaPagoDetailActions from '../actions/forma-pago-detail.actions';
import { Router } from "@angular/router";
import { BaseService } from "src/app/shared/service/base-service.service";
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ResponseOne } from "src/app/shared/models/entidades/responseOne.model";
import { FormaPago } from "src/app/shared/models/entidades/formaPago.model";

@Injectable()
export class FormaPagoDetailEffects extends BaseService {
  constructor(
    private actions$: Actions,
    private formaPagoDetailService: FormasPagoService,
    private router: Router,
    messageService: MessageService,
    http: HttpClient
  ) {
    super(http, messageService);
  }

  getFormaPago$ = createEffect(() => this.actions$.pipe(
    ofType(FormaPagoDetailActions.GetFormaPago),
    mergeMap(({ id }) => this.formaPagoDetailService.getById(id)
      .pipe(
        map(formaPagoPorId => FormaPagoDetailActions.GetFormaPagoSuccess({ formaPagoPorId })),
        catchError((error) => {
          return of(FormaPagoDetailActions.GetFormaPagoFail({ errorMessage: error }));
        })
      )
    )
  ));

  updateFormaPago$ = createEffect(() => this.actions$.pipe(
    ofType(FormaPagoDetailActions.UpdateFormaPago),
    mergeMap(({ formaPago }) => this.formaPagoDetailService.update(formaPago)
      .pipe(
        map((response: any) => {
          const successMessage = response.message;
          this.handleSuccess(successMessage);
          return FormaPagoDetailActions.UpdateFormaPagoSuccess({ successMessage });
        }),
        catchError((error) => {
          return of(FormaPagoDetailActions.UpdateFormaPagoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  createFormaPago$ = createEffect(() => this.actions$.pipe(
    ofType(FormaPagoDetailActions.CreateFormaPago),
    mergeMap(({ payload }) => this.formaPagoDetailService.create(payload)
      .pipe(
        map((formaPago: ResponseOne<FormaPago>) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'Forma de pago creada correctamente',
            life: 5000
          });

          return FormaPagoDetailActions.CreateFormaPagoSuccess({ formaPago });
        }),
        catchError((error) => {
          const errorMessage = this.getErrorMessage(error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
          });

          return of(FormaPagoDetailActions.CreateFormaPagoFailure({ errorMessage }));
        })
      )
    ))
  );

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
