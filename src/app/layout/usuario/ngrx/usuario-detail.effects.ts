import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap } from "rxjs";
import { UsuarioService } from "../service/usuario.service";
import * as UsuarioDetailActions from './usuario-detail.actions';
import { Router } from "@angular/router";
import { BaseService } from "src/app/shared/service/base-service.service";
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Injectable()
export class UsuarioDetailEffects extends BaseService {
  constructor(
    private actions$: Actions,
    private usuarioDetailService: UsuarioService,
    private router: Router,
    messageService: MessageService,
    http: HttpClient
  ) {
    super(http, messageService);
  }

  updateUsuario$ = createEffect(() => this.actions$.pipe(
    ofType(UsuarioDetailActions.UpdateUsuario),
    mergeMap(({ usuario }) => this.usuarioDetailService.update(usuario)
      .pipe(
        map((response: any) => {
          const successMessage = response.message;
          this.handleSuccess(successMessage);
          return UsuarioDetailActions.UpdateUsuarioSuccess({ successMessage });
        }),
        catchError((error) => {
          return of(UsuarioDetailActions.UpdateUsuarioFailure({ errorMessage: error }));
        })
      )
    )
  ));

  deleteUsuario$ = createEffect(() => this.actions$.pipe(
    ofType(UsuarioDetailActions.DeleteUsuario),
    mergeMap((action) => this.usuarioDetailService.delete(action.id).pipe(
      map(() => {
        return UsuarioDetailActions.DeleteUsuarioSuccess();
      }),
      catchError((error) => {
        return of(UsuarioDetailActions.DeleteUsuarioFailure({ errorMessage: error }));
      })
    ))
  ));
}
