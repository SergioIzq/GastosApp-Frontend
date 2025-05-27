import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, filter, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectErrorCarga, selectLoading } from '../../ngrx/selectors/traspasos-list.selectors';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as SelectTraspasosList from '../../ngrx/selectors/traspasos-list.selectors';
import * as TraspasosListActions from 'src/app/layout/traspasos/ngrx/actions/traspasos-list.actions';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { Traspaso } from 'src/app/shared/models/entidades/traspaso.model';
import { cloneDeep } from 'lodash';
import { PrimeNGConfig } from 'primeng/api';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { EntidadListState } from 'src/app/shared/models/entidades/estados/entidadListState.model';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';
import { ExportarExcelOpciones } from '../../../../shared/excel/exportar-excel-opciones.interface';
import { exportarExcel } from 'src/app/shared/excel/actions/excel.actions';

@Component({
  selector: 'app-traspasos-list',
  templateUrl: './traspasos-list.component.html',
  styleUrls: ['./traspasos-list.component.css']
})
export class TraspasosListComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  respuesta: ResponseData<Traspaso> = new ResponseData();
  error$: Observable<boolean> = new Observable();
  traspasoToDeleteId!: number | null;
  showConfirmationDialog: boolean = false;
  searchValue: string = '';
  @ViewChild('dt') dt!: Table;
  errorMessage!: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  indiceActual = 0;
  cantidadPorPagina = 10;
  globalFilter: { value: string, matchMode: string } | null = null;
  isButtonDisabled: boolean = true;
  transformedData: any = [];
  page: number = 1;
  size: number = 10;
  totalRecords: number = 0;
  first = 0;
  totalPages: number = 1;
  idUsuario!: number;
  columnas: { label: string; value: string }[] = [];

  constructor(
    private store: Store<EntidadListState<Traspaso>>,
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

    this.loadTraspasos()

    this.actionsSubject.pipe(filter(action => action.type === 'DeleteTraspasoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.loadTraspasos()
      });

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

    this.store.select(SelectTraspasosList.selectLoading).pipe(takeUntil(this.destroy$)).subscribe((loading: boolean) => {
      this.loading = loading;
    });

    this.error$ = this.store.select(SelectTraspasosList.selectErrorCarga);

    this.error$ = this.store.select(selectErrorCarga);

    this.store.select(SelectTraspasosList.selectTraspasosList).pipe(takeUntil(this.destroy$)).subscribe(respuesta => {
      if (respuesta) {
        // Clonar respuesta de manera profunda
        this.respuesta = cloneDeep(respuesta);
        this.totalRecords = this.respuesta.TotalRecords;
        this.totalPages = Math.ceil(this.totalRecords / this.size);

        this.transformedData = this.transformData(respuesta);

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

  onDeleteTraspaso() {
    this.showConfirmationDialog = false;
    this.store.dispatch(TraspasosListActions.DeleteTraspaso({ id: this.traspasoToDeleteId! }));
    this.loadTraspasos()
  }

  applyFilterGlobal(event: Event, matchMode: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    this.globalFilter = { value, matchMode };
    this.loadTraspasos()
  }

  showDeleteConfirmationDialog(id: number) {
    this.showConfirmationDialog = true;
    this.traspasoToDeleteId = id;
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
    opciones.nombreArchivo = "Traspasos";
    this.store.dispatch(exportarExcel({ url: "traspaso", opciones }));
  }

  // Función para transformar el objeto
  transformData(data: ResponseData<Traspaso>) {
    return data.Items.map((item: any) => ({
      Id: item.Id,
      Fecha: this.formatFecha(item.Fecha),
      CuentaOrigen: item.CuentaOrigen.Nombre,
      SaldoCuentaOrigen: item.SaldoCuentaOrigen,
      CuentaDestino: item.CuentaDestino.Nombre,
      SaldoCuentaDestino: item.SaldoCuentaDestino,
      Importe: item.Importe,
      Descripcion: item.Descripcion,
    }));
  }

  formatFecha(fechaStr: string): string {
    return this.getDateTimeLocalFormat(new Date(fechaStr));
  }

  getDateTimeLocalFormat(date: Date): string {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`;
  }

  public loadTraspasos(): void {
    this.store.dispatch(TraspasosListActions.LoadingTraspasos({ page: this.page, size: this.size, idUsuario: this.idUsuario }));
  }

  onPageChange(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.size = event.rows;
    this.first = event.first; // Actualiza la página inicial
    this.loadTraspasos();
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
