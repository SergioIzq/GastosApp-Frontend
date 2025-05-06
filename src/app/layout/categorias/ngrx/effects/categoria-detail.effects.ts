import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap, tap } from "rxjs";
import { CategoriaService } from "../../service/categoria.service";
import * as CategoriaDetailActions from "../actions/categoria-detail.actions";
import { Router } from "@angular/router";
import { MessageService } from 'primeng/api';
import { Categoria } from "src/app/shared/models/entidades/categoria.model";
import { ResponseOne } from "src/app/shared/models/entidades/respuestas/respuestas-genericas/responseOne.model";

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
          return of(CategoriaDetailActions.GetCategoriaFail({ errorMessage: error }));
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
          return of(CategoriaDetailActions.UpdateCategoriaFailure({ errorMessage: error }));
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


          return of(CategoriaDetailActions.CreateCategoriaFailure({ errorMessage: error }));
        })
      )
    ))
  );

}
