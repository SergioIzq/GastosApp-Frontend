import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, mergeMap } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import * as ConceptosListActions from 'src/app/layout/conceptos/ngrx/actions/conceptos-list.actions';
import { ConceptoService } from '../../service/concepto.service';
import { ResponseData } from '../../../../shared/models/entidades/responseData.model';
import { Concepto } from 'src/app/shared/models/entidades/concepto.model';
import { MessageService } from 'primeng/api';

@Injectable()
export class ConceptosListEffects {
  constructor(
    private actions$: Actions,
    private conceptosService: ConceptoService,
    private messageService: MessageService // Inyectamos el MessageService
  ) { }

  loadConceptos$ = createEffect(() => this.actions$.pipe(
    ofType(ConceptosListActions.LoadingConceptos),
    mergeMap(({ page, size, idUsuario }) =>
      this.conceptosService.getCantidad(page, size, idUsuario).pipe(
        map((listaConceptos: ResponseData<Concepto>) => ConceptosListActions.LoadingConceptosSuccess({ listaConceptos })),
        catchError((error) => {
          return of(ConceptosListActions.LoadingConceptosFailure({ errorMessage: error }));
        })
      )
    )
  ));

  deleteConcepto$ = createEffect(() => this.actions$.pipe(
    ofType(ConceptosListActions.DeleteConcepto),
    mergeMap((action) => this.conceptosService.delete(action.id).pipe(
      map(() => {
        this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Concepto eliminado correctamente', life: 5000 });
        return ConceptosListActions.DeleteConceptoSuccess();
      }),
      catchError((error) => {
        return of(ConceptosListActions.DeleteConceptoFailure({ errorMessage: error }));
      })
    ))
  ));

  exportExcel$ = createEffect(() => this.actions$.pipe(
    ofType(ConceptosListActions.ExportExcelConcepto),
    mergeMap(({ res }) =>
      this.conceptosService.exportExcel(res).pipe(
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
        map(() => ConceptosListActions.ExportExcelConceptoSuccess()),
        catchError((error) => {
          return of(ConceptosListActions.ExportExcelConceptoFailure({ errorMessage: error }));
        })
      )
    )
  ));
}
