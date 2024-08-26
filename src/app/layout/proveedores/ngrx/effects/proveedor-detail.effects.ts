import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap } from "rxjs";
import { ProveedorService } from "../../service/proveedores.service";
import * as ProveedorDetailActions from '../actions/proveedor-detail.actions';
import { Router } from "@angular/router";
import { BaseService } from "src/app/shared/service/base-service.service";
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ResponseOne } from "src/app/shared/models/entidades/responseOne.model";
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
            summary: 'Success',
            detail: 'Proveedor creada correctamente',
            life: 5000
          });

          return ProveedorDetailActions.CreateProveedorSuccess({ proveedor });
        }),
        catchError((error) => {
          const errorMessage = this.getErrorMessage(error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
          });

          return of(ProveedorDetailActions.CreateProveedorFailure({ errorMessage }));
        })
      )
    ))
  );

  // Método para obtener el mensaje de error
  private getErrorMessage(error: any): string {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
      }
    }
    return errorMessage;
  }
}
