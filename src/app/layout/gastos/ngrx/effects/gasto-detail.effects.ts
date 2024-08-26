import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap, tap } from "rxjs";
import { GastoService } from "../../service/gasto.service";
import * as GastoDetailActions from "../actions/gasto-detail.actions";
import { Router } from "@angular/router";
import { MessageService } from 'primeng/api';
import { ResponseOne } from "src/app/shared/models/entidades/responseOne.model";
import { Gasto } from "src/app/shared/models/entidades/gasto.model";
import { BaseService } from "src/app/shared/service/base-service.service";
import { HttpClient } from "@angular/common/http";

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
            summary: 'Success',
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

  getCuentas$ = createEffect(() => this.actions$.pipe(
    ofType(GastoDetailActions.GetCuentasGasto),
    mergeMap(({ idUsuario }) => this.gastoDetailService.getCuentas(idUsuario)
      .pipe(
        map(cuentas => GastoDetailActions.GetCuentasGastoSuccess({ cuentas })),
        catchError((error) => {
          return of(GastoDetailActions.GetCuentasGastoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  getProveedores$ = createEffect(() => this.actions$.pipe(
    ofType(GastoDetailActions.GetProveedoresGasto),
    mergeMap(({ idUsuario }) => this.gastoDetailService.getProveedores(idUsuario)
      .pipe(
        map(proveedores => GastoDetailActions.GetProveedoresGastoSuccess({ proveedores })),
        catchError((error) => {
          return of(GastoDetailActions.GetProveedoresGastoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  getFormasPago$ = createEffect(() => this.actions$.pipe(
    ofType(GastoDetailActions.GetFormasPagoGasto),
    mergeMap(({ idUsuario }) => this.gastoDetailService.getFormasPago(idUsuario)
      .pipe(
        map(formasPago => GastoDetailActions.GetFormasPagoGastoSuccess({ formasPago })),
        catchError((error) => {
          return of(GastoDetailActions.GetFormasPagoGastoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  getPersonas$ = createEffect(() => this.actions$.pipe(
    ofType(GastoDetailActions.GetPersonasGasto),
    mergeMap(({ idUsuario }) => this.gastoDetailService.getPersonas(idUsuario)
      .pipe(
        map(personas => GastoDetailActions.GetPersonasGastoSuccess({ personas })),
        catchError((error) => {
          return of(GastoDetailActions.GetPersonasGastoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  getConceptos$ = createEffect(() => this.actions$.pipe(
    ofType(GastoDetailActions.GetConceptosGasto),
    mergeMap(({ idUsuario }) => this.gastoDetailService.getConceptos(idUsuario)
      .pipe(
        map(conceptos => GastoDetailActions.GetConceptosGastoSuccess({ conceptos })),
        catchError((error) => {
          return of(GastoDetailActions.GetConceptosGastoFailure({ errorMessage: error }));
        })
      )
    )
  ));

}
