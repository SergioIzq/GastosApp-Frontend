import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, mergeMap } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import * as FormasPagosListActions from 'src/app/layout/formas-pago/ngrx/actions/formas-pago-list.actions';
import { FormasPagoService } from '../../service/formas-pago.service';
import { ResponseData } from '../../../../shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { FormaPago } from 'src/app/shared/models/entidades/formaPago.model';
import { MessageService } from 'primeng/api';

@Injectable()
export class FormasPagoListEffects {
  constructor(
    private actions$: Actions,
    private formasPagoService: FormasPagoService,
    private messageService: MessageService
  ) { }

  loadFormasPago$ = createEffect(() => this.actions$.pipe(
    ofType(FormasPagosListActions.LoadingFormasPago),
    mergeMap(({ page, size, idUsuario }) =>
      this.formasPagoService.getCantidad(page, size, idUsuario).pipe(
        map((listaFormasPago: ResponseData<FormaPago>) => FormasPagosListActions.LoadingFormasPagoSuccess({ listaFormasPago })),
        catchError((error) => {
          return of(FormasPagosListActions.LoadingFormasPagoFailure({ errorMessage: error }));
        })
      )
    )
  ));

  deleteFormasPago$ = createEffect(() => this.actions$.pipe(
    ofType(FormasPagosListActions.DeleteFormaPago),
    mergeMap((action) => this.formasPagoService.delete(action.id).pipe(
      map(() => {
        this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Forma de pago eliminada correctamente', life: 5000 });
        return FormasPagosListActions.DeleteFormaPagoSuccess();
      }),
      catchError((error) => {
        return of(FormasPagosListActions.DeleteFormaPagoFailure({ errorMessage: error }));
      })
    ))
  ));

}
