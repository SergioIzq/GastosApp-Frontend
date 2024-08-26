import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap, tap } from "rxjs";
import { IngresoService } from "../../service/ingreso.service";
import * as IngresoDetailActions from "../actions/ingreso-detail.actions";
import { Router } from "@angular/router";
import { MessageService } from 'primeng/api';
import { ResponseOne } from "src/app/shared/models/entidades/responseOne.model";
import { Ingreso } from "src/app/shared/models/entidades/ingreso.model";
import { BaseService } from "src/app/shared/service/base-service.service";
import { HttpClient } from "@angular/common/http";

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
        map((ingreso: ResponseOne<Ingreso>) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
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

  getCuentas$ = createEffect(() => this.actions$.pipe(
    ofType(IngresoDetailActions.GetCuentasIngreso),
    mergeMap(({ idUsuario }) => this.ingresoDetailService.getCuentas(idUsuario)
      .pipe(
        map(cuentas => IngresoDetailActions.GetCuentasIngresoSuccess({ cuentas })),
        catchError((error) => {
          return of(IngresoDetailActions.GetCuentasIngresoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  getClientes$ = createEffect(() => this.actions$.pipe(
    ofType(IngresoDetailActions.GetClientesIngreso),
    mergeMap(({ idUsuario }) => this.ingresoDetailService.getClientes(idUsuario)
      .pipe(
        map(clientes => IngresoDetailActions.GetClientesIngresoSuccess({ clientes })),
        catchError((error) => {
          return of(IngresoDetailActions.GetClientesIngresoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  getFormasPago$ = createEffect(() => this.actions$.pipe(
    ofType(IngresoDetailActions.GetFormasPagoIngreso),
    mergeMap(({ idUsuario }) => this.ingresoDetailService.getFormasPago(idUsuario)
      .pipe(
        map(formasPago => IngresoDetailActions.GetFormasPagoIngresoSuccess({ formasPago })),
        catchError((error) => {
          return of(IngresoDetailActions.GetFormasPagoIngresoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  getPersonas$ = createEffect(() => this.actions$.pipe(
    ofType(IngresoDetailActions.GetPersonasIngreso),
    mergeMap(({ idUsuario }) => this.ingresoDetailService.getPersonas(idUsuario)
      .pipe(
        map(personas => IngresoDetailActions.GetPersonasIngresoSuccess({ personas })),
        catchError((error) => {
          return of(IngresoDetailActions.GetPersonasIngresoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  getConceptos$ = createEffect(() => this.actions$.pipe(
    ofType(IngresoDetailActions.GetConceptosIngreso),
    mergeMap(({ idUsuario }) => this.ingresoDetailService.getConceptos(idUsuario)
      .pipe(
        map(conceptos => IngresoDetailActions.GetConceptosIngresoSuccess({ conceptos })),
        catchError((error) => {
          return of(IngresoDetailActions.GetConceptosIngresoFailure({ errorMessage: error }));
        })
      )
    )
  ));
}
