import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, filter, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { selectErrorCarga } from '../../ngrx/selectors/formas-pago-list.selectors';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as SelectFormasPagoList from '../../ngrx/selectors/formas-pago-list.selectors'
import * as FormasPagoListActions from 'src/app/layout/formas-pago/ngrx/actions/formas-pago-list.actions';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { FormaPago } from 'src/app/shared/models/entidades/formaPago.model';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { PrimeNGConfig } from 'primeng/api';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import { EntidadListState } from 'src/app/shared/models/entidades/estados/entidadListState.model';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';
import { ExportarExcelOpciones } from 'src/app/shared/excel/exportar-excel-opciones.interface';
import { exportarExcel } from 'src/app/shared/excel/actions/excel.actions';


@Component({
  selector: 'app-formas-pago-list',
  templateUrl: './formas-pago-list.component.html',
  styleUrls: ['./formas-pago-list.component.css']
})
export class FormasPagoListComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  respuesta: ResponseData<FormaPago> = new ResponseData();
  error$: Observable<boolean> = new Observable();
  formaPagoToDeleteId!: number | null;
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
    private store: Store<EntidadListState<FormaPago>>,
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
    this.loadFormasPago()

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

    this.store.select(SelectFormasPagoList.selectLoading).pipe(takeUntil(this.destroy$)).subscribe((loading: boolean) => {
      this.loading = loading;
    });

    this.error$ = this.store.select(SelectFormasPagoList.selectErrorCarga);

    this.actionsSubject.pipe(filter(action => action.type === 'DeleteFormaPagoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.loadFormasPago()
      });

    this.error$ = this.store.select(selectErrorCarga);

    this.store.select(SelectFormasPagoList.selectFormasPagoList).pipe(takeUntil(this.destroy$)).subscribe(respuesta => {
      if (respuesta) {
        // Clonar respuesta de manera profunda
        this.respuesta = cloneDeep(respuesta);
        this.totalRecords = this.respuesta.TotalRecords;

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

  onDeleteFormaPago() {
    this.showConfirmationDialog = false;
    this.store.dispatch(FormasPagoListActions.DeleteFormaPago({ id: this.formaPagoToDeleteId! }));
    this.loadFormasPago()
  }

  applyFilterGlobal(event: Event, matchMode: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    this.globalFilter = { value, matchMode };
    this.loadFormasPago()
  }

  showDeleteConfirmationDialog(id: number) {
    this.showConfirmationDialog = true;
    this.formaPagoToDeleteId = id;
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
    opciones.nombreArchivo = "Formas de pago";
    this.store.dispatch(exportarExcel({ url: "formapago", opciones }));
  }

  public loadFormasPago(): void {
    this.store.dispatch(FormasPagoListActions.LoadingFormasPago({ page: this.page, size: this.size, idUsuario: this.idUsuario }));
  }

  onPageChange(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.size = event.rows;
    this.first = event.first; // Actualiza la página inicial
    this.loadFormasPago();
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
