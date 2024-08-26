import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, mergeMap } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import * as CategoriasListActions from 'src/app/layout/categorias/ngrx/actions/categorias-list.actions';
import { CategoriaService } from '../../service/categoria.service';
import { ResponseData } from '../../../../shared/models/entidades/responseData.model';
import { Categoria } from 'src/app/shared/models/entidades/categoria.model';
import { MessageService } from 'primeng/api';

@Injectable()
export class CategoriasListEffects {
  constructor(
    private actions$: Actions,
    private categoriasService: CategoriaService,
    private messageService: MessageService // Inyectamos el MessageService
  ) { }

  loadCategorias$ = createEffect(() => this.actions$.pipe(
    ofType(CategoriasListActions.LoadingCategorias),
    mergeMap(({ page, size, idUsuario }) =>
      this.categoriasService.getCantidad(page, size, idUsuario).pipe(
        map((listaCategorias: ResponseData<Categoria>) => CategoriasListActions.LoadingCategoriasSuccess({ listaCategorias })),
        catchError((error) => {
          return of(CategoriasListActions.LoadingCategoriasFailure({ errorMessage: error }));
        })
      )
    )
  ));

  deleteCategoria$ = createEffect(() => this.actions$.pipe(
    ofType(CategoriasListActions.DeleteCategoria),
    mergeMap((action) => this.categoriasService.delete(action.id).pipe(
      map(() => {
        this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Categoria eliminada correctamente', life: 5000 });
        return CategoriasListActions.DeleteCategoriaSuccess();
      }),
      catchError((error) => {
        return of(CategoriasListActions.DeleteCategoriaFailure({ errorMessage: error }));
      })
    ))
  ));

  exportExcel$ = createEffect(() => this.actions$.pipe(
    ofType(CategoriasListActions.ExportExcelCategoria),
    mergeMap(({ res }) =>
      this.categoriasService.exportExcel(res).pipe(
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
        map(() => CategoriasListActions.ExportExcelCategoriaSuccess()),
        catchError((error) => {
          return of(CategoriasListActions.ExportExcelCategoriaFailure({ errorMessage: error }));
        })
      )
    )
  ));

}
