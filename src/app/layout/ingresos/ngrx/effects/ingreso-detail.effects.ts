import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap, tap } from "rxjs";
import { IngresoService } from "../../service/ingreso.service";
import * as IngresoDetailActions from "../actions/ingreso-detail.actions";
import { Router } from "@angular/router";
import { MessageService } from 'primeng/api';
import { ResponseOne } from "src/app/shared/models/entidades/respuestas/respuestas-genericas/responseOne.model";
import { Ingreso } from "src/app/shared/models/entidades/ingreso.model";
import { BaseService } from "src/app/shared/service/base-service.service";
import { HttpClient } from "@angular/common/http";
import { IngresoByIdRespuesta } from "src/app/shared/models/entidades/respuestas/ingresos/ingresoByIdRespuesta.model";

@Injectable()
export class IngresoDetailEffects extends BaseService {
  constructor(
    private actions$: Actions,
    private ingresoDetailService: IngresoService,
    private router: Router,
    messageService: MessageService,
    http: HttpClient
  ) {
    super(http, messageService);
  }

  getIngreso$ = createEffect(() => this.actions$.pipe(
    ofType(IngresoDetailActions.GetIngreso),
    mergeMap(({ id }) => this.ingresoDetailService.getById(id)
      .pipe(
        map(ingreso => IngresoDetailActions.GetIngresoSuccess({ ingreso })),
        catchError((error) => {
          return of(IngresoDetailActions.GetIngresoFail({ errorMessage: error }));
        })
      )
    )
  ));

  getNewIngreso$ = createEffect(() => this.actions$.pipe(
    ofType(IngresoDetailActions.GetNewIngreso),
    mergeMap(({ payload }) => this.ingresoDetailService.getNewIngreso(payload)
      .pipe(
        map(payload => IngresoDetailActions.GetNewIngresoSuccess({ payload })),
        catchError((error) => {
          return of(IngresoDetailActions.GetNewIngresoFail());
        })
      )
    )
  ));

  updateIngreso$ = createEffect(() => this.actions$.pipe(
    ofType(IngresoDetailActions.UpdateIngreso),
    mergeMap(({ ingreso }) => this.ingresoDetailService.update(ingreso)
      .pipe(
        map(updatedIngreso => {
          this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Ingreso actualizado correctamente', life: 5000 });
          return IngresoDetailActions.UpdateIngresoSuccess({ ingreso: updatedIngreso });
        }),
        catchError((error) => {
          return of(IngresoDetailActions.UpdateIngresoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  createIngreso$ = createEffect(() => this.actions$.pipe(
    ofType(IngresoDetailActions.CreateIngreso),
    mergeMap(({ payload }) => this.ingresoDetailService.create(payload)
      .pipe(
        map((ingreso: ResponseOne<IngresoByIdRespuesta>) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'Ingreso creado correctamente',
            life: 5000
          });

          return IngresoDetailActions.CreateIngresoSuccess({ ingreso });
        }),
        catchError((error) => {

          return of(IngresoDetailActions.CreateIngresoFailure({ errorMessage: error }));
        })
      )
    ))
  );
}  