import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, mergeMap } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import * as ClientesListActions from 'src/app/layout/clientes/ngrx/actions/clientes-list.actions';
import { ClienteService } from '../../service/clientes.service';
import { ResponseData } from '../../../../shared/models/entidades/respuestas/responseData.model';
import { Cliente } from 'src/app/shared/models/entidades/cliente.model';
import { MessageService } from 'primeng/api';

@Injectable()
export class ClientesListEffects {
  constructor(
    private actions$: Actions,
    private clientesService: ClienteService,
    private messageService: MessageService
  ) { }

  loadClientes$ = createEffect(() => this.actions$.pipe(
    ofType(ClientesListActions.LoadingClientes),
    mergeMap(({ page, size, idUsuario }) =>
      this.clientesService.getCantidad(page, size, idUsuario).pipe(
        map((listaClientes: ResponseData<Cliente>) => ClientesListActions.LoadingClientesSuccess({ listaClientes })),
        catchError((error) => {
          return of(ClientesListActions.LoadingClientesFailure({ errorMessage: error }));
        })
      )
    )
  ));

  deleteCliente$ = createEffect(() => this.actions$.pipe(
    ofType(ClientesListActions.DeleteCliente),
    mergeMap(action => 
      this.clientesService.delete(action.id).pipe(
        map((response: any) => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Operación exitosa', 
            detail: 'Cliente eliminado correctamente', 
            life: 5000 
          });
          return ClientesListActions.DeleteClienteSuccess();
        }),
        catchError(error => {
          // Aquí podrías querer manejar el error de forma más específica
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'No se pudo eliminar el cliente', 
            life: 5000 
          });
          return of(ClientesListActions.DeleteClienteFailure({ errorMessage: error.message || 'Error desconocido' }));
        })
      )
    )
  ));
  
  exportExcel$ = createEffect(() => this.actions$.pipe(
    ofType(ClientesListActions.ExportExcelClientes),
    mergeMap(({ res }) =>
      this.clientesService.exportExcel(res).pipe(
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
        map(() => ClientesListActions.ExportExcelClientesSuccess()),
        catchError((error) => {
          return of(ClientesListActions.ExportExcelClientesFailure({ errorMessage: error }));
        })
      )
    )
  ));

}
