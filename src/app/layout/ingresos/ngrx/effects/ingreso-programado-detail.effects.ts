import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap } from "rxjs";
import { IngresoService } from "../../service/ingreso.service";
import * as IngresoProgramadoDetailActions from "../actions/ingreso-programado-detail.actions";
import { Router } from "@angular/router";
import { MessageService } from 'primeng/api';
import { ResponseOne } from "src/app/shared/models/entidades/respuestas/responseOne.model";
import { BaseService } from "src/app/shared/service/base-service.service";
import { HttpClient } from "@angular/common/http";
import { IngresoProgramado } from "src/app/shared/models/entidades/ingresoProgramado.model";

@Injectable()
export class IngresoProgramadoDetailEffects extends BaseService {
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
    ofType(IngresoProgramadoDetailActions.GetIngresoProgramado),
    mergeMap(({ id }) => this.ingresoDetailService.getIngresoProgramadoById(id)
      .pipe(
        map(ingresoProgramado => IngresoProgramadoDetailActions.GetIngresoProgramadoSuccess({ ingresoProgramado })),
        catchError((error) => {
          return of(IngresoProgramadoDetailActions.GetIngresoProgramadoFail({ errorMessage: error }));
        })
      )
    )
  ));

  getNewIngreso$ = createEffect(() => this.actions$.pipe(
    ofType(IngresoProgramadoDetailActions.GetNewIngresoProgramado),
    mergeMap(({ payload }) => this.ingresoDetailService.getNewIngreso(payload)
      .pipe(
        map(payload => IngresoProgramadoDetailActions.GetNewIngresoProgramadoSuccess({ payload })),
        catchError((error) => {
          return of(IngresoProgramadoDetailActions.GetNewIngresoProgramadoFail({ errorMessage: error }));
        })
      )
    )
  ));

  updateIngreso$ = createEffect(() => this.actions$.pipe(
    ofType(IngresoProgramadoDetailActions.UpdateIngresoProgramado),
    mergeMap(({ ingresoProgramado }) => this.ingresoDetailService.updateIngresoProgramado(ingresoProgramado)
      .pipe(
        map(updatedIngreso => {
          this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Ingreso programado actualizado correctamente', life: 5000 });
          return IngresoProgramadoDetailActions.UpdateIngresoProgramadoSuccess({ ingresoProgramado: updatedIngreso });
        }),
        catchError((error) => {
          return of(IngresoProgramadoDetailActions.UpdateIngresoProgramadoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  createIngreso$ = createEffect(() => this.actions$.pipe(
    ofType(IngresoProgramadoDetailActions.CreateIngresoProgramado),
    mergeMap(({ payload }) => this.ingresoDetailService.createIngresoProgramado(payload)
      .pipe(
        map((ingresoProgramado: ResponseOne<IngresoProgramado>) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'Ingreso programado creado correctamente',
            life: 5000
          });

          return IngresoProgramadoDetailActions.CreateIngresoProgramadoSuccess({ ingresoProgramado });
        }),
        catchError((error) => {
          return of(IngresoProgramadoDetailActions.CreateIngresoProgramadoFailure({ errorMessage: error }));
        })
      )
    ))
  );
  
}
