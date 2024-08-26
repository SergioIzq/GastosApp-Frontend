import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as MenuActions from '../actions/menu.actions';
import { map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/service/base-service.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { MenuService } from '../../service/menu.service';

@Injectable()
export class MenuEffects extends BaseService {
  constructor(
    private actions$: Actions,
    private menuService: MenuService,
    private router: Router,
    messageService: MessageService,
    http: HttpClient
  ) {
    super(http, messageService);
  }
  
  getUsuario$ = createEffect(() => this.actions$.pipe(
    ofType(MenuActions.GetUsuario),
    mergeMap(({ id }) => this.menuService.getById(id)
      .pipe(
        map(usuarioPorId => MenuActions.GetUsuarioSuccess({ usuarioPorId })),
        catchError((error) => {
          return of(MenuActions.GetUsuarioFail({ errorMessage: error }));
        })
      )
    )
  ));

}
