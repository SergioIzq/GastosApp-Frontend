import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap, tap, switchMap } from "rxjs";
import { GastoService } from "../../service/gasto.service";
import * as GastoDetailActions from "../actions/gasto-detail.actions";
import { Router } from "@angular/router";
import { MessageService } from 'primeng/api';
import { ResponseOne } from "src/app/shared/models/entidades/respuestas/respuestas-genericas/responseOne.model";
import { Gasto } from "src/app/shared/models/entidades/gasto.model";
import { BaseService } from "src/app/shared/service/base-service.service";
import { HttpClient } from "@angular/common/http";
import { GastoByIdRespuesta } from "src/app/shared/models/entidades/respuestas/gastos/gastoByIdRespuesta.model";

@Injectable()
export class GastoDetailEffects extends BaseService {
  constructor(
    private actions$: Actions,
    private gastoDetailService: GastoService,
    private router: Router,
    messageService: MessageService,
    http: HttpClient
  ) {
    super(http, messageService);
  }

  getGasto$ = createEffect(() => this.actions$.pipe(
    ofType(GastoDetailActions.GetGasto),
    mergeMap(({ id }) => this.gastoDetailService.getById(id)
      .pipe(
        map(gasto => GastoDetailActions.GetGastoSuccess({ gasto })),
        catchError((error) => {
          return of(GastoDetailActions.GetGastoFail({ errorMessage: error }));
        })
      )
    )
  ));

  getNewGasto$ = createEffect(() => this.actions$.pipe(
    ofType(GastoDetailActions.GetNewGasto),
    mergeMap(({ payload }) => this.gastoDetailService.getNewGasto(payload)
      .pipe(
        map(payload => GastoDetailActions.GetNewGastoSuccess({ payload })),
        catchError((error) => {
          return of(GastoDetailActions.GetNewGastoFail({ errorMessage: error }));
        })
      )
    )
  ));

  updateGasto$ = createEffect(() => this.actions$.pipe(
    ofType(GastoDetailActions.UpdateGasto),
    mergeMap(({ gasto }) => this.gastoDetailService.update(gasto)
      .pipe(
        map(updatedGasto => {
          this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Gasto actualizado correctamente', life: 5000 });
          return GastoDetailActions.UpdateGastoSuccess({ gasto: updatedGasto });
        }),
        catchError((error) => {
          return of(GastoDetailActions.UpdateGastoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  createGasto$ = createEffect(() => this.actions$.pipe(
    ofType(GastoDetailActions.CreateGasto),
    mergeMap(({ payload }) => this.gastoDetailService.create(payload)
      .pipe(
        map((gasto: ResponseOne<Gasto>) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'Gasto creado correctamente',
            life: 5000
          });

          return GastoDetailActions.CreateGastoSuccess({ gasto });
        }),
        catchError((error) => {
          return of(GastoDetailActions.CreateGastoFailure({ errorMessage: error }));
        })
      )
    ))
  );
  
}
