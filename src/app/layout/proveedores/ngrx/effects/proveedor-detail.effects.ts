import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap } from "rxjs";
import { ProveedorService } from "../../service/proveedores.service";
import * as ProveedorDetailActions from '../actions/proveedor-detail.actions';
import { Router } from "@angular/router";
import { BaseService } from "src/app/shared/service/base-service.service";
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ResponseOne } from "src/app/shared/models/entidades/respuestas/responseOne.model";
import { Proveedor } from "src/app/shared/models/entidades/proveedor.model";

@Injectable()
export class ProveedorDetailEffects extends BaseService {
  constructor(
    private actions$: Actions,
    private proveedorDetailService: ProveedorService,
    private router: Router,
    messageService: MessageService,
    http: HttpClient
  ) {
    super(http, messageService);
  }

  getProveedor$ = createEffect(() => this.actions$.pipe(
    ofType(ProveedorDetailActions.GetProveedor),
    mergeMap(({ id }) => this.proveedorDetailService.getById(id)
      .pipe(
        map(proveedorPorId => ProveedorDetailActions.GetProveedorSuccess({ proveedorPorId })),
        catchError((error) => {
          return of(ProveedorDetailActions.GetProveedorFail({ errorMessage: error }));
        })
      )
    )
  ));

  updateProveedor$ = createEffect(() => this.actions$.pipe(
    ofType(ProveedorDetailActions.UpdateProveedor),
    mergeMap(({ proveedor }) => this.proveedorDetailService.update(proveedor)
      .pipe(
        map((response: any) => {
          const successMessage = response.message;
          this.handleSuccess(successMessage);
          return ProveedorDetailActions.UpdateProveedorSuccess({ successMessage });
        }),
        catchError((error) => {
          return of(ProveedorDetailActions.UpdateProveedorFailure({ errorMessage: error }));
        })
      )
    )
  ));

  createProveedor$ = createEffect(() => this.actions$.pipe(
    ofType(ProveedorDetailActions.CreateProveedor),
    mergeMap(({ payload }) => this.proveedorDetailService.create(payload)
      .pipe(
        map((proveedor: ResponseOne<Proveedor>) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'Proveedor creado correctamente',
            life: 5000
          });

          return ProveedorDetailActions.CreateProveedorSuccess({ proveedor });
        }),
        catchError((error) => {

          return of(ProveedorDetailActions.CreateProveedorFailure({ errorMessage: error }));
        })
      )
    ))
  );

}
