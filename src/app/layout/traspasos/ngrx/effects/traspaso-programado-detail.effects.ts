import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap } from "rxjs";
import { TraspasoService } from "../../service/traspaso.service";
import * as TraspasoProgramadoDetailActions from "../actions/traspaso-programado-detail.actions";
import { Router } from "@angular/router";
import { MessageService } from 'primeng/api';
import { ResponseOne } from "src/app/shared/models/entidades/respuestas/respuestas-genericas/responseOne.model";
import { BaseService } from "src/app/shared/service/base-service.service";
import { HttpClient } from "@angular/common/http";
import { TraspasoProgramado } from "src/app/shared/models/entidades/traspasoProgramado.model";

@Injectable()
export class TraspasoProgramadoDetailEffects extends BaseService {
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
    ofType(TraspasoProgramadoDetailActions.GetTraspasoProgramado),
    mergeMap(({ id }) => this.traspasoDetailService.getTraspasoProgramadoById(id)
      .pipe(
        map(traspasoProgramado => TraspasoProgramadoDetailActions.GetTraspasoProgramadoSuccess({ traspasoProgramado })),
        catchError((error) => {
          return of(TraspasoProgramadoDetailActions.GetTraspasoProgramadoFail({ errorMessage: error }));
        })
      )
    )
  ));

  getNewTraspaso$ = createEffect(() => this.actions$.pipe(
    ofType(TraspasoProgramadoDetailActions.GetNewTraspasoProgramado),
    mergeMap(({ payload }) => this.traspasoDetailService.getNewTraspaso(payload)
      .pipe(
        map(payload => TraspasoProgramadoDetailActions.GetNewTraspasoProgramadoSuccess({ payload })),
        catchError((error) => {
          return of(TraspasoProgramadoDetailActions.GetNewTraspasoProgramadoFail({ errorMessage: error }));
        })
      )
    )
  ));

  updateTraspaso$ = createEffect(() => this.actions$.pipe(
    ofType(TraspasoProgramadoDetailActions.UpdateTraspasoProgramado),
    mergeMap(({ traspasoProgramado }) => this.traspasoDetailService.updateTraspasoProgramado(traspasoProgramado)
      .pipe(
        map(updatedTraspaso => {
          this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Traspaso programado actualizado correctamente', life: 5000 });
          return TraspasoProgramadoDetailActions.UpdateTraspasoProgramadoSuccess({ traspasoProgramado: updatedTraspaso });
        }),
        catchError((error) => {
          return of(TraspasoProgramadoDetailActions.UpdateTraspasoProgramadoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  createTraspaso$ = createEffect(() => this.actions$.pipe(
    ofType(TraspasoProgramadoDetailActions.CreateTraspasoProgramado),
    mergeMap(({ payload }) => this.traspasoDetailService.createTraspasoProgramado(payload)
      .pipe(
        map((traspasoProgramado: ResponseOne<TraspasoProgramado>) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'Traspaso programado creado correctamente',
            life: 5000
          });

          return TraspasoProgramadoDetailActions.CreateTraspasoProgramadoSuccess({ traspasoProgramado });
        }),
        catchError((error) => {
          return of(TraspasoProgramadoDetailActions.CreateTraspasoProgramadoFailure({ errorMessage: error }));
        })
      )
    ))
  );
  
}
