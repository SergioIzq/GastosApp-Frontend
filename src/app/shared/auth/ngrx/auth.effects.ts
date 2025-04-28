import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { BaseService } from '../../service/base-service.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthEffects extends BaseService {

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    messageService: MessageService,
    http: HttpClient
  ) {
    super(http, messageService);
  }

  login$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.login),
    mergeMap(({ Correo, Contrasena }) => this.authService.login(Correo, Contrasena)
      .pipe(
        map((respuesta: any) => {

          this.messageService.add({
            severity: 'info',
            summary: 'Operación exitosa',
            detail: 'Inicio de sesión correcto',
            life: 5000
          });

          return AuthActions.loginSuccess({ respuesta });
        }),
        catchError((error) => {
          return of(AuthActions.loginFailure({ error }));
        })
      )
    ))
  );

  signUp$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.signUp),
    mergeMap(({ Correo, Contrasena }) => this.authService.signUp(Correo, Contrasena)
      .pipe(
        map((token: any) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'Usuario registrado correctamente',
            life: 5000
          });

          return AuthActions.signUpSuccess({ token });
        }),
        catchError((error) => {
          return of(AuthActions.signUpFailure({ error }));
        })
      )
    ))
  );

}
