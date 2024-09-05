import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, mergeMap } from "rxjs";
import { ClienteService } from "../../service/clientes.service";
import * as ClienteDetailActions from '../actions/cliente-detail.actions';
import { Router } from "@angular/router";
import { BaseService } from "src/app/shared/service/base-service.service";
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ResponseOne } from "src/app/shared/models/entidades/responseOne.model";
import { Cliente } from "src/app/shared/models/entidades/cliente.model";

@Injectable()
export class ClienteDetailEffects extends BaseService {
  constructor(
    private actions$: Actions,
    private clienteDetailService: ClienteService,
    private router: Router,
    messageService: MessageService,
    http: HttpClient
  ) {
    super(http, messageService);
  }

  getCliente$ = createEffect(() => this.actions$.pipe(
    ofType(ClienteDetailActions.GetCliente),
    mergeMap(({ id }) => this.clienteDetailService.getById(id)
      .pipe(
        map(clientePorId => ClienteDetailActions.GetClienteSuccess({ clientePorId })),
        catchError((error) => {
          return of(ClienteDetailActions.GetClienteFail({ errorMessage: error }));
        })
      )
    )
  ));

  updateCliente$ = createEffect(() => this.actions$.pipe(
    ofType(ClienteDetailActions.UpdateCliente),
    mergeMap(({ cliente }) => this.clienteDetailService.update(cliente)
      .pipe(
        map((response: any) => {
          const successMessage = response.message;
          this.handleSuccess(successMessage);
          return ClienteDetailActions.UpdateClienteSuccess({ successMessage });
        }),
        catchError((error) => {
          return of(ClienteDetailActions.UpdateClienteFailure({ errorMessage: error }));
        })
      )
    )
  ));

  createCliente$ = createEffect(() => this.actions$.pipe(
    ofType(ClienteDetailActions.CreateCliente),
    mergeMap(({ payload }) => this.clienteDetailService.create(payload)
      .pipe(
        map((cliente: ResponseOne<Cliente>) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'Cliente creado correctamente',
            life: 5000
          });

          return ClienteDetailActions.CreateClienteSuccess({ cliente });
        }),
        catchError((error) => {

          return of(ClienteDetailActions.CreateClienteFailure({ errorMessage:error }));
        })
      )
    ))
  );


}
