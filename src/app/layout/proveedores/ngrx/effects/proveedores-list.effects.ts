import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, mergeMap } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import * as ProveedoresListActions from 'src/app/layout/proveedores/ngrx/actions/proveedores-list.actions';
import { ProveedorService } from '../../service/proveedores.service';
import { ResponseData } from '../../../../shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { Proveedor } from 'src/app/shared/models/entidades/proveedor.model';
import { MessageService } from 'primeng/api';

@Injectable()
export class ProveedoresListEffects {
  constructor(
    private actions$: Actions,
    private proveedorService: ProveedorService,
    private messageService: MessageService
  ) { }

  loadProveedores$ = createEffect(() => this.actions$.pipe(
    ofType(ProveedoresListActions.LoadingProveedores),
    mergeMap(({ page, size, idUsuario }) =>
      this.proveedorService.getCantidad(page, size, idUsuario).pipe(
        map((listaProveedores: ResponseData<Proveedor>) => ProveedoresListActions.LoadingProveedoresSuccess({ listaProveedores })),
        catchError((error) => {
          return of(ProveedoresListActions.LoadingProveedoresFailure({ errorMessage: error }));
        })
      )
    )
  ));

  deleteProveedor$ = createEffect(() => this.actions$.pipe(
    ofType(ProveedoresListActions.DeleteProveedor),
    mergeMap((action) => this.proveedorService.delete(action.id).pipe(
      map(() => {
        this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Proveedor eliminado correctamente', life: 5000 });
        return ProveedoresListActions.DeleteProveedorSuccess();
      }),
      catchError((error) => {
        return of(ProveedoresListActions.DeleteProveedorFailure({ errorMessage: error }));
      })
    ))
  ));
}
