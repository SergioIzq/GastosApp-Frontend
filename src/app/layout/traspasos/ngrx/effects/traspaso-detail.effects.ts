import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap } from "rxjs";
import { TraspasoService } from "../../service/traspaso.service";
import * as TraspasoDetailActions from '../actions/traspaso-detail.actions';
import { Router } from "@angular/router";
import { BaseService } from "src/app/shared/service/base-service.service";
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { TraspasoByIdRespuesta } from "src/app/shared/models/entidades/respuestas/traspasos/traspasoByIdRespuesta.model";

@Injectable()
export class TraspasoDetailEffects extends BaseService {
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
    ofType(TraspasoDetailActions.GetTraspaso),
    mergeMap(({ id }) => this.traspasoDetailService.getById(id)
      .pipe(
        map(traspasoPorId => TraspasoDetailActions.GetTraspasoSuccess({ traspasoPorId })),
        catchError((error) => {
          return of(TraspasoDetailActions.GetTraspasoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  updateTraspaso$ = createEffect(() => this.actions$.pipe(
    ofType(TraspasoDetailActions.UpdateTraspaso),
    mergeMap(({ traspaso }) => this.traspasoDetailService.update(traspaso)
      .pipe(
        map((response: any) => {
          const successMessage = response.message;
          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'Traspaso actualizado correctamente',
            life: 5000
          });

          return TraspasoDetailActions.UpdateTraspasoSuccess({ successMessage });
        }),
        catchError((error) => {
          return of(TraspasoDetailActions.UpdateTraspasoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  realizarTraspaso$ = createEffect(() => this.actions$.pipe(
    ofType(TraspasoDetailActions.RealizarTraspaso),
    mergeMap(({ payload }) => this.traspasoDetailService.realizarTraspaso(payload)
      .pipe(
        map((traspaso: TraspasoByIdRespuesta) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'Traspaso creado correctamente',
            life: 5000
          });

          return TraspasoDetailActions.RealizarTraspasoSuccess({ traspaso });
        }),
        catchError((error) => {

          return of(TraspasoDetailActions.RealizarTraspasoFail({ errorMessage: error }));
        })
      )
    ))
  );

    getNewTraspaso$ = createEffect(() => this.actions$.pipe(
      ofType(TraspasoDetailActions.GetNewTraspaso),
      mergeMap(({ payload }) => this.traspasoDetailService.getNewTraspaso(payload)
        .pipe(
          map(payload => TraspasoDetailActions.GetNewTraspasoSuccess({ payload })),
          catchError((error) => {
            return of(TraspasoDetailActions.GetNewTraspasoFail());
          })
        )
      )
    ));
  

}
