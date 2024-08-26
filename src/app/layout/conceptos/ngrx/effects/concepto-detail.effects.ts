import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap } from "rxjs";
import { ConceptoService } from "../../service/concepto.service";
import * as ConceptoDetailActions from '../actions/concepto-detail.actions';
import { Router } from "@angular/router";
import { BaseService } from "src/app/shared/service/base-service.service";
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ResponseOne } from "src/app/shared/models/entidades/responseOne.model";
import { Concepto } from "src/app/shared/models/entidades/concepto.model";

@Injectable()
export class ConceptoDetailEffects extends BaseService {
  constructor(
    private actions$: Actions,
    private conceptoDetailService: ConceptoService,
    private router: Router,
    messageService: MessageService,
    http: HttpClient
  ) {
    super(http, messageService);
  }

  getConcepto$ = createEffect(() => this.actions$.pipe(
    ofType(ConceptoDetailActions.GetConcepto),
    mergeMap(({ id }) => this.conceptoDetailService.getById(id)
      .pipe(
        map(conceptoPorId => ConceptoDetailActions.GetConceptoSuccess({ conceptoPorId })),
        catchError((error) => {
          return of(ConceptoDetailActions.GetConceptoFail({ errorMessage: error }));
        })
      )
    )
  ));

  getCategorias$ = createEffect(() => this.actions$.pipe(
    ofType(ConceptoDetailActions.GetCategorias),
    mergeMap(({ idUsuario }) => this.conceptoDetailService.getCategorias(idUsuario)
      .pipe(
        map(categorias => ConceptoDetailActions.GetCategoriasSuccess({ categorias })),
        catchError((error) => {
          return of(ConceptoDetailActions.GetCategoriasFailure({ errorMessage: error }));
        })
      )
    )
  ));

  updateConcepto$ = createEffect(() => this.actions$.pipe(
    ofType(ConceptoDetailActions.UpdateConcepto),
    mergeMap(({ concepto }) => this.conceptoDetailService.update(concepto)
      .pipe(
        map((response: any) => {
          const successMessage = response.message;
          this.handleSuccess(successMessage);
          return ConceptoDetailActions.UpdateConceptoSuccess({ successMessage });
        }),
        catchError((error) => {
          return of(ConceptoDetailActions.UpdateConceptoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  createConcepto$ = createEffect(() => this.actions$.pipe(
    ofType(ConceptoDetailActions.CreateConcepto),
    mergeMap(({ payload }) => this.conceptoDetailService.create(payload)
      .pipe(
        map((concepto: ResponseOne<Concepto>) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'Concepto creado correctamente',
            life: 5000
          });

          return ConceptoDetailActions.CreateConceptoSuccess({ concepto });
        }),
        catchError((error) => {
          const errorMessage = this.getErrorMessage(error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
          });

          return of(ConceptoDetailActions.CreateConceptoFailure({ errorMessage }));
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
