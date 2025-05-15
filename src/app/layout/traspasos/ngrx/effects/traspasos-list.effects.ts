import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, mergeMap } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import * as TraspasosListActions from 'src/app/layout/traspasos/ngrx/actions/traspasos-list.actions';
import { TraspasoService } from '../../service/traspaso.service';
import { ResponseData } from '../../../../shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { Traspaso } from 'src/app/shared/models/entidades/traspaso.model';
import { MessageService } from 'primeng/api';

@Injectable()
export class TraspasosListEffects {
    constructor(
        private actions$: Actions,
        private traspasosService: TraspasoService,
        private messageService: MessageService // Inyectamos el MessageService
    ) { }

    loadTraspasos$ = createEffect(() => this.actions$.pipe(
        ofType(TraspasosListActions.LoadingTraspasos),
        mergeMap(({ page, size, idUsuario }) =>
            this.traspasosService.getCantidad(page, size, idUsuario).pipe(
                map((listaTraspasos: ResponseData<Traspaso>) => TraspasosListActions.LoadingTraspasosSuccess({ listaTraspasos })),
                catchError((error) => {
                    return of(TraspasosListActions.LoadingTraspasosFailure({ errorMessage: error }));
                })
            )
        )
    ));
    deleteTraspaso$ = createEffect(() => this.actions$.pipe(
        ofType(TraspasosListActions.DeleteTraspaso),
        mergeMap((action) => this.traspasosService.delete(action.id).pipe(
            map(() => {
                this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Traspaso eliminado correctamente', life: 5000 });
                return TraspasosListActions.DeleteTraspasoSuccess();
            }),
            catchError((error) => {
                return of(TraspasosListActions.DeleteTraspasoFailure({ errorMessage: error }));
            })
        ))
    ));

    exportExcel$ = createEffect(() => this.actions$.pipe(
        ofType(TraspasosListActions.ExportExcelTraspaso),
        mergeMap(({ res }) =>
            this.traspasosService.exportExcel(res).pipe(
                // Acción en caso de éxito
                tap(() => {
                    // Mostrar mensaje de éxito
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Operación exitosa',
                        detail: 'Los datos se han exportado a Excel correctamente.',
                        life: 5000
                    });
                }),
                map(() => TraspasosListActions.ExportExcelTraspasoSuccess()),
                catchError((error) => {
                    return of(TraspasosListActions.ExportExcelTraspasoFailure({ errorMessage: error }));
                })
            )
        )
    ));
}
