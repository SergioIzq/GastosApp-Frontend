import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, mergeMap } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import * as PersonasListActions from 'src/app/layout/personas/ngrx/actions/personas-list.actions';
import { PersonaService } from '../../service/personas.service';
import { ResponseData } from '../../../../shared/models/entidades/respuestas/responseData.model';
import { Persona } from 'src/app/shared/models/entidades/persona.model';
import { MessageService } from 'primeng/api';

@Injectable()
export class PersonasListEffects {
  constructor(
    private actions$: Actions,
    private personasService: PersonaService,
    private messageService: MessageService
  ) { }

  loadPersonas$ = createEffect(() => this.actions$.pipe(
    ofType(PersonasListActions.LoadingPersonas),
    mergeMap(({ page, size, idUsuario }) =>
      this.personasService.getCantidad(page, size, idUsuario).pipe(
        map((listaPersonas: ResponseData<Persona>) => PersonasListActions.LoadingPersonasSuccess({ listaPersonas })),
        catchError((error) => {
          return of(PersonasListActions.LoadingPersonasFailure({ errorMessage: error }));
        })
      )
    )
  ));

  deletePersona$ = createEffect(() => this.actions$.pipe(
    ofType(PersonasListActions.DeletePersona),
    mergeMap((action) => this.personasService.delete(action.id).pipe(
      map(() => {
        this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Persona eliminada correctamente', life: 5000 });
        return PersonasListActions.DeletePersonaSuccess();
      }),
      catchError((error) => {
        return of(PersonasListActions.DeletePersonaFailure({ errorMessage: error }));
      })
    ))
  ));

  exportExcel$ = createEffect(() => this.actions$.pipe(
    ofType(PersonasListActions.ExportExcelPersona),
    mergeMap(({ res }) =>
      this.personasService.exportExcel(res).pipe(
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
        map(() => PersonasListActions.ExportExcelPersonaSuccess()),
        catchError((error) => {
          return of(PersonasListActions.ExportExcelPersonaFailure({ errorMessage: error }));
        })
      )
    )
  ));
}
