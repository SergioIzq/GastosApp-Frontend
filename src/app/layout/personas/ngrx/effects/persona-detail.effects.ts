import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap } from "rxjs";
import { PersonaService } from "../../service/personas.service";
import * as PersonaDetailActions from '../actions/persona-detail.actions';
import { Router } from "@angular/router";
import { BaseService } from "src/app/shared/service/base-service.service";
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ResponseOne } from "src/app/shared/models/entidades/responseOne.model";
import { Persona } from "src/app/shared/models/entidades/persona.model";

@Injectable()
export class PersonaDetailEffects extends BaseService {
  constructor(
    private actions$: Actions,
    private personaDetailService: PersonaService,
    private router: Router,
    messageService: MessageService,
    http: HttpClient
  ) {
    super(http, messageService);
  }

  getPersona$ = createEffect(() => this.actions$.pipe(
    ofType(PersonaDetailActions.GetPersona),
    mergeMap(({ id }) => this.personaDetailService.getById(id)
      .pipe(
        map(personaPorId => PersonaDetailActions.GetPersonaSuccess({ personaPorId })),
        catchError((error) => {
          return of(PersonaDetailActions.GetPersonaFail({ errorMessage: error }));
        })
      )
    )
  ));

  updatePersona$ = createEffect(() => this.actions$.pipe(
    ofType(PersonaDetailActions.UpdatePersona),
    mergeMap(({ persona }) => this.personaDetailService.update(persona)
      .pipe(
        map((response: any) => {
          const successMessage = response.message;
          this.handleSuccess(successMessage);
          return PersonaDetailActions.UpdatePersonaSuccess({ successMessage });
        }),
        catchError((error) => {
          return of(PersonaDetailActions.UpdatePersonaFailure({ errorMessage: error }));
        })
      )
    )
  ));

  createPersona$ = createEffect(() => this.actions$.pipe(
    ofType(PersonaDetailActions.CreatePersona),
    mergeMap(({ payload }) => this.personaDetailService.create(payload)
      .pipe(
        map((persona: ResponseOne<Persona>) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'Persona creada correctamente',
            life: 5000
          });

          return PersonaDetailActions.CreatePersonaSuccess({ persona });
        }),
        catchError((error) => {
          const errorMessage = this.getErrorMessage(error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
          });

          return of(PersonaDetailActions.CreatePersonaFailure({ errorMessage }));
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
