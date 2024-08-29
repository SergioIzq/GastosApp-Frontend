import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, filter, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { selectErrorCarga } from '../../ngrx/selectors/clientes-list.selectors';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as SelectClientesList from '../../ngrx/selectors/clientes-list.selectors'
import * as ClientesListActions from 'src/app/layout/clientes/ngrx/actions/clientes-list.actions';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/shared/models/entidades/responseData.model';
import { Cliente } from 'src/app/shared/models/entidades/cliente.model';
import { cloneDeep } from 'lodash';
import { PrimeNGConfig } from 'primeng/api';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.css']
})
export class ClientesListComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  respuesta: ResponseData<Cliente> = new ResponseData();
  error$: Observable<boolean> = new Observable();
  clienteToDeleteId!: number | null;
  showConfirmationDialog: boolean = false;
  searchValue: string = '';
  @ViewChild('dt') dt!: Table;
  errorMessage!: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  indiceActual = 0;
  cantidadPorPagina = 10;
  globalFilter: { value: string, matchMode: string } | null = null;
  isButtonDisabled: boolean = true;
  page: number = 1;
  size: number = 10;
  totalRecords: number = 0;
  first = 0;
  totalPages: number = 1;
  idUsuario!: number;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private location: Location,
    private actionsSubject: ActionsSubject,
    private primengConfig: PrimeNGConfig
  ) { }

  ngOnInit(): void {

    this.store.select(selectUserId).pipe(takeUntil(this.destroy$)).subscribe((idUsuario: number) => {
      this.idUsuario = idUsuario;
    });

    this.loadClientes()

    this.primengConfig.setTranslation({
      accept: 'Aceptar',
      reject: 'Rechazar',
      apply: 'Aplicar',
      clear: 'Limpiar',
      addRule: 'Añadir regla',
      removeRule: 'Eliminar regla',
      matchAll: 'Cumplir todas',
      matchAny: 'Cumplir alguna'
    });

    this.store.select(SelectClientesList.selectLoading).pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.loading = loading;
    });
    this.error$ = this.store.select(SelectClientesList.selectErrorCarga);

    this.actionsSubject.pipe(
      filter(action => action.type === 'DeleteClienteSuccess'),
      takeUntil(this.destroy$)
    ).subscribe((action: any) => {
      this.loadClientes()
    });


    this.error$ = this.store.select(selectErrorCarga);

    this.store.select(SelectClientesList.selectClientesList).pipe(takeUntil(this.destroy$)).subscribe(respuesta => {
      if (respuesta) {
        // Clonar respuesta de manera profunda
        this.respuesta = cloneDeep(respuesta);
        this.totalRecords = this.respuesta.TotalRecords;
        this.totalPages = Math.ceil(this.totalRecords / this.size);

        if (this.respuesta.Items.length > 0) {
          this.isButtonDisabled = false;
        } else {
          this.isButtonDisabled = true;
        }
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  onDeleteCliente() {
    this.showConfirmationDialog = false;

    this.store.dispatch(ClientesListActions.DeleteCliente({ id: this.clienteToDeleteId! }));
  }

  applyFilterGlobal(event: Event, matchMode: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    this.globalFilter = { value, matchMode };
    this.loadClientes()
  }

  showDeleteConfirmationDialog(id: number) {
    this.showConfirmationDialog = true;
    this.clienteToDeleteId = id;
  }

  getDialogWidth(): string {
    const maxWidthSmallScreens = 300;

    // Obtener el ancho de la ventana del navegador
    const windowWidth = window.innerWidth;

    // Si la ventana es menor que un cierto tamaño, devuelve el ancho máximo para pantallas pequeñas
    if (windowWidth < 576) {
      return `${maxWidthSmallScreens}px`;
    }

    // Si no, devuelve el ancho predeterminado del diálogo
    return '25rem';
  }

  exportarAExcel(): void {
    const exportData = this.respuesta.Items.map(item => {
      return {
        'Nombre': item.Nombre,
      };
    });
  
    // Crear una nueva hoja de trabajo de Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
  
    // Crear un nuevo libro de Excel y agregar la hoja de trabajo
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Clientes': worksheet },
      SheetNames: ['Clientes']
    };
  
    // Generar el archivo Excel en formato binario
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Crear un blob para el archivo
    const blob: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
    // Guardar el archivo en la carpeta de descargas del usuario
    saveAs(blob, 'clientes.xlsx');
  }
  

  public loadClientes(): void {
    this.store.dispatch(ClientesListActions.LoadingClientes({ page: this.page, size: this.size, idUsuario: this.idUsuario }));
  }

  onPageChange(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.size = event.rows;
    this.first = event.first; // Actualiza la página inicial
    this.loadClientes();
  }

}
