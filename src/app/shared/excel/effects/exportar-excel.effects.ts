import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, catchError, tap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { saveAs } from 'file-saver';
import * as ExcelActions from '../actions/excel.actions';
import { ExportarExcelService } from '../service/exportarExcel.service';
import { MessageService } from 'primeng/api';

@Injectable()
export class ExportarExcelEffects {
  constructor(
    private actions$: Actions,
    private exportarExcelService: ExportarExcelService,
    private messageService: MessageService
  ) { }

  exportarExcel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExcelActions.exportarExcel),
      mergeMap(({ url, opciones }) =>
        this.exportarExcelService.exportExcel(url, opciones).pipe(
          tap((blob) => {
            const nombreArchivo = `${opciones.nombreArchivo}.xlsx`;
            saveAs(blob, nombreArchivo);

            this.messageService.add({
              severity: 'success',
              summary: 'Exportación exitosa',
              detail: `Se ha descargado el archivo ${nombreArchivo}`,
              life: 5000
            });
          }),
          map((blob) =>
            ExcelActions.exportarExcelSuccess({
              blob,
              nombreArchivo: `${opciones.nombreArchivo}.xlsx`
            })
          ),
          catchError((error) =>
            of(ExcelActions.exportarExcelFail({ error }))
          )
        )
      )
    )
  );
}
