import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap, tap } from "rxjs";
import { CategoriaService } from "../../service/categoria.service";
import * as CategoriaDetailActions from "../actions/categoria-detail.actions";
import { Router } from "@angular/router";
import { MessageService } from 'primeng/api';
import { Categoria } from "src/app/shared/models/entidades/categoria.model";
import { ResponseOne } from "src/app/shared/models/entidades/responseOne.model";

@Injectable()
export class CategoriaDetailEffects {
  constructor(
    private actions$: Actions,
    private categoriaDetailService: CategoriaService,
    private router: Router,
    private messageService: MessageService
  ) { }

  getCategoria$ = createEffect(() => this.actions$.pipe(
    ofType(CategoriaDetailActions.GetCategoria),
    mergeMap(({ id }) => this.categoriaDetailService.getById(id)
      .pipe(
        map(categoria => CategoriaDetailActions.GetCategoriaSuccess({ categoria })),
        catchError((error) => {
          const errorMessage = this.getErrorMessage(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 5000 });
          return of(CategoriaDetailActions.GetCategoriaFail({ errorMessage }));
        })
      )
    )
  ));

  updateCategoria$ = createEffect(() => this.actions$.pipe(
    ofType(CategoriaDetailActions.UpdateCategoria),
    mergeMap(({ categoria }) => this.categoriaDetailService.update(categoria)
      .pipe(
        map(updatedCategoria => {
          this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Categoría actualizada correctamente', life: 5000 });
          return CategoriaDetailActions.UpdateCategoriaSuccess({ categoria: updatedCategoria });
        }),
        catchError((error) => {
          const errorMessage = this.getErrorMessage(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 5000 });
          return of(CategoriaDetailActions.UpdateCategoriaFailure({ errorMessage }));
        })
      )
    )
  ));

  createCategoria$ = createEffect(() => this.actions$.pipe(
    ofType(CategoriaDetailActions.CreateCategoria),
    mergeMap(({ payload }) => this.categoriaDetailService.create(payload)
      .pipe(
        map((categoria: ResponseOne<Categoria>) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'Categoría creada correctamente',
            life: 5000
          });

          return CategoriaDetailActions.CreateCategoriaSuccess({ categoria });
        }),
        catchError((error) => {
          const errorMessage = this.getErrorMessage(error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
          });

          return of(CategoriaDetailActions.CreateCategoriaFailure({ errorMessage }));
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
