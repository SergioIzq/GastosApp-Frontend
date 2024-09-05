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

          return of(ConceptoDetailActions.CreateConceptoFailure({ errorMessage: error }));
        })
      )
    ))
  );


}
