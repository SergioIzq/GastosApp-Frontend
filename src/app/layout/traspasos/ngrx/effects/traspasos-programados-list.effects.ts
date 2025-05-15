import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, mergeMap } from "rxjs";
import { map, catchError } from "rxjs/operators";
import * as TraspasosProgramadosListActions from 'src/app/layout/traspasos/ngrx/actions/traspasos-programados-list.actions';
import { TraspasoService } from '../../service/traspaso.service';
import { ResponseData } from '../../../../shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { MessageService } from 'primeng/api';
import { TraspasoProgramado } from "src/app/shared/models/entidades/traspasoProgramado.model";

@Injectable()
export class TraspasosProgramadosListEffects {
  constructor(
    private actions$: Actions,
    private traspasosService: TraspasoService,
    private messageService: MessageService // Inyectamos el MessageService
  ) { }

  loadTraspasos$ = createEffect(() => this.actions$.pipe(
    ofType(TraspasosProgramadosListActions.LoadingTraspasosProgramados),
    mergeMap(({ page, size, idUsuario }) =>
      this.traspasosService.getCantidadTraspasosProgramados(page, size, idUsuario).pipe(
        map((listaTraspasosProgramados: ResponseData<TraspasoProgramado>) => TraspasosProgramadosListActions.LoadingTraspasosProgramadosSuccess({ listaTraspasosProgramados })),
        catchError((error) => {
          return of(TraspasosProgramadosListActions.LoadingTraspasosProgramadosFailure({ errorMessage: error }));
        })
      )
    )
  ));

  deleteTraspaso$ = createEffect(() => this.actions$.pipe(
    ofType(TraspasosProgramadosListActions.DeleteTraspasoProgramado),
    mergeMap((action) => this.traspasosService.deleteTraspasoProgramado(action.id).pipe(
      map(() => {
        this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Traspaso programado eliminado correctamente', life: 5000 });
        return TraspasosProgramadosListActions.DeleteTraspasoProgramadoSuccess();
      }),
      catchError((error) => {
        return of(TraspasosProgramadosListActions.DeleteTraspasoProgramadoFailure({ errorMessage: error }));
      })
    ))
  ));

}
