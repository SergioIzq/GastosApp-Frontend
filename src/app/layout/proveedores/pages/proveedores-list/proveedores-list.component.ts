import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, filter, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectErrorCarga } from '../../ngrx/selectors/proveedores-list.selectors';
import { ActionsSubject, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as SelectProveedoresList from '../../ngrx/selectors/proveedores-list.selectors'
import * as ProveedoresListActions from 'src/app/layout/proveedores/ngrx/actions/proveedores-list.actions';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { Proveedor } from 'src/app/shared/models/entidades/proveedor.model';
import { cloneDeep } from 'lodash';
import { PrimeNGConfig } from 'primeng/api';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { EntidadListState } from 'src/app/shared/models/entidades/estados/entidadListState.model';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';
import { ExportarExcelOpciones } from 'src/app/shared/excel/exportar-excel-opciones.interface';
import { exportarExcel } from 'src/app/shared/excel/actions/excel.actions';


@Component({
  selector: 'app-proveedores-list',
  templateUrl: './proveedores-list.component.html',
  styleUrls: ['./proveedores-list.component.css']
})
export class ProveedoresListComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  respuesta: ResponseData<Proveedor> = new ResponseData();
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
  columnas: { label: string; value: string }[] = [];

  constructor(
    private store: Store<EntidadListState<Proveedor>>,
    private _store: Store<AuthState>,
    private router: Router,
    private location: Location,
    private actionsSubject: ActionsSubject,
    private primengConfig: PrimeNGConfig
  ) { }

  ngOnInit(): void {

    this._store.select(selectUserId).pipe(takeUntil(this.destroy$)).subscribe((idUsuario: number) => {
      this.idUsuario = idUsuario;
    });

    this.loadProveedores()

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

    this.store.select(SelectProveedoresList.selectLoading).pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.loading = loading;
    });
    this.error$ = this.store.select(SelectProveedoresList.selectErrorCarga);

    this.actionsSubject.pipe(filter(action => action.type === 'DeleteProveedorSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.loadProveedores()
      });

    this.error$ = this.store.select(selectErrorCarga);

    this.store.select(SelectProveedoresList.selectProveedoresList).pipe(takeUntil(this.destroy$)).subscribe(respuesta => {
      if (respuesta) {
        // Clonar respuesta de manera profunda
        this.respuesta = cloneDeep(respuesta);
        this.totalRecords = this.respuesta.TotalRecords;
        this.totalPages = Math.ceil(this.totalRecords / this.size);

        if (this.respuesta.Items && this.respuesta.Items.length > 0) {
          this.columnas = Object.keys(this.respuesta.Items[0])
            .filter(key => key !== 'Id' && key !== 'IdUsuario' && key !== 'FechaCreacion' && key !== 'HangfireJobId')
            .map(key => ({
              label: this.splitCamelCase(key),
              value: key
            }));
        } else {
          this.columnas = [];
        }

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

  onDeleteProveedor() {
    this.showConfirmationDialog = false;
    this.store.dispatch(ProveedoresListActions.DeleteProveedor({ id: this.clienteToDeleteId! }));
    this.loadProveedores()
  }

  applyFilterGlobal(event: Event, matchMode: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    this.globalFilter = { value, matchMode };
    this.loadProveedores()
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

  onExportar(opciones: ExportarExcelOpciones) {
    opciones.nombreArchivo = "Proveedores";
    this.store.dispatch(exportarExcel({ url: "proveedor", opciones }));
  }

  public loadProveedores(): void {
    this.store.dispatch(ProveedoresListActions.LoadingProveedores({ page: this.page, size: this.size, idUsuario: this.idUsuario }));
  }

  onPageChange(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.size = event.rows;
    this.first = event.first; // Actualiza la página inicial
    this.loadProveedores();
  }

  addBlur() {
    document.body.classList.add('blur-background');
  }

  removeBlur() {
    document.body.classList.remove('blur-background');
  }

  splitCamelCase(text: string) {
    return text.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
}
