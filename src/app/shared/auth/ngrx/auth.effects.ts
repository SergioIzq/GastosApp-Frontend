import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
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
            detail: 'Usuario registrado correctamente, mire su email y confirme el correo',
            life: 5000
          });

          return AuthActions.signUpSuccess();
        }),
        catchError((error) => {
          return of(AuthActions.signUpFailure({ error }));
        })
      )
    ))
  );
  
  confirmEmail$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.confirmEmail),
    mergeMap(({ token }) =>
      this.authService.confirmEmail(token).pipe(
        map(() => AuthActions.confirmEmailSuccess()),
        catchError((error) => of(AuthActions.confirmEmailFailure({ error })))
      )
    )
  ));

  confirmEmailSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.confirmEmailSuccess),
    tap(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Cuenta confirmada',
        detail: 'Redirigiendo a la página principal...',
        life: 5000
      });
      setTimeout(() => this.router.navigate(['/']), 5000);
    })
  ), { dispatch: false });

  confirmEmailFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.confirmEmailFailure),
    tap(({ error }) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al confirmar',
        detail: error?.error || 'Token inválido o expirado.',
        life: 5000
      });
    })
  ), { dispatch: false });

}
