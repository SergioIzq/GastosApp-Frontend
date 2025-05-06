import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap } from "rxjs";
import { GastoService } from "../../service/gasto.service";
import * as GastoProgramadoDetailActions from "../actions/gasto-programado-detail.actions";
import { Router } from "@angular/router";
import { MessageService } from 'primeng/api';
import { ResponseOne } from "src/app/shared/models/entidades/respuestas/responseOne.model";
import { Gasto } from "src/app/shared/models/entidades/gasto.model";
import { BaseService } from "src/app/shared/service/base-service.service";
import { HttpClient } from "@angular/common/http";
import { GastoProgramado } from "src/app/shared/models/entidades/gastoProgramado.model";

@Injectable()
export class GastoProgramadoDetailEffects extends BaseService {
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
    ofType(GastoProgramadoDetailActions.GetGastoProgramado),
    mergeMap(({ id }) => this.gastoDetailService.getGastoProgramadoById(id)
      .pipe(
        map(gastoProgramado => GastoProgramadoDetailActions.GetGastoProgramadoSuccess({ gastoProgramado })),
        catchError((error) => {
          return of(GastoProgramadoDetailActions.GetGastoProgramadoFail({ errorMessage: error }));
        })
      )
    )
  ));

  getNewGasto$ = createEffect(() => this.actions$.pipe(
    ofType(GastoProgramadoDetailActions.GetNewGastoProgramado),
    mergeMap(({ payload }) => this.gastoDetailService.getNewGasto(payload)
      .pipe(
        map(payload => GastoProgramadoDetailActions.GetNewGastoProgramadoSuccess({ payload })),
        catchError((error) => {
          return of(GastoProgramadoDetailActions.GetNewGastoProgramadoFail({ errorMessage: error }));
        })
      )
    )
  ));

  updateGasto$ = createEffect(() => this.actions$.pipe(
    ofType(GastoProgramadoDetailActions.UpdateGastoProgramado),
    mergeMap(({ gastoProgramado }) => this.gastoDetailService.updateGastoProgramado(gastoProgramado)
      .pipe(
        map(updatedGasto => {
          this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Gasto programado actualizado correctamente', life: 5000 });
          return GastoProgramadoDetailActions.UpdateGastoProgramadoSuccess({ gastoProgramado: updatedGasto });
        }),
        catchError((error) => {
          return of(GastoProgramadoDetailActions.UpdateGastoProgramadoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  createGasto$ = createEffect(() => this.actions$.pipe(
    ofType(GastoProgramadoDetailActions.CreateGastoProgramado),
    mergeMap(({ payload }) => this.gastoDetailService.createGastoProgramado(payload)
      .pipe(
        map((gastoProgramado: ResponseOne<GastoProgramado>) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'Gasto programado creado correctamente',
            life: 5000
          });

          return GastoProgramadoDetailActions.CreateGastoProgramadoSuccess({ gastoProgramado });
        }),
        catchError((error) => {
          return of(GastoProgramadoDetailActions.CreateGastoProgramadoFailure({ errorMessage: error }));
        })
      )
    ))
  );
  
}
