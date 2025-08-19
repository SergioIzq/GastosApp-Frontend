import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap } from "rxjs";
import * as ContactoFormActions from './contacto.actions';
import { Router } from "@angular/router";
import { BaseService } from "src/app/shared/service/base-service.service";
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ContactoFormService } from "../service/contacto.service";

@Injectable()
export class ContactoFormEffects extends BaseService {
  constructor(
    private actions$: Actions,
    private formContactoService: ContactoFormService,
    private router: Router,
    messageService: MessageService,
    http: HttpClient
  ) {
    super(http, messageService);
  }

  enviarFormContacto$ = createEffect(() => this.actions$.pipe(
    ofType(ContactoFormActions.EnviarFormContacto),
    mergeMap(({ form }) => this.formContactoService.enviarContactoForm(form)
      .pipe(
        map((response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'Correo enviado correctamente correctamente',
            life: 5000
          });

          return ContactoFormActions.EnviarFormContactoSuccess({ successMessage: response });
        }),
        catchError((error) => {
          return of(ContactoFormActions.EnviarFormContactoFailure({ errorMessage: error }));
        })
      )
    )
  ));
}