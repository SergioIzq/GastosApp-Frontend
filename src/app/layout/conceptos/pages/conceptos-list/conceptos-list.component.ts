import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, filter, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectErrorCarga } from '../../ngrx/selectors/conceptos-list.selectors';
import { ActionsSubject, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as SelectConceptosList from '../../ngrx/selectors/conceptos-list.selectors'
import * as ConceptosListActions from 'src/app/layout/conceptos/ngrx/actions/conceptos-list.actions';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { Concepto } from 'src/app/shared/models/entidades/concepto.model';
import { cloneDeep } from 'lodash';
import { PrimeNGConfig } from 'primeng/api';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import { EntidadListState } from 'src/app/shared/models/entidades/estados/entidadListState.model';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';
import { ExportarExcelOpciones } from 'src/app/shared/excel/exportar-excel-opciones.interface';
import { exportarExcel } from 'src/app/shared/excel/actions/excel.actions';

@Component({
  selector: 'app-conceptos-list',
  templateUrl: './conceptos-list.component.html',
  styleUrls: ['./conceptos-list.component.css']
})
export class ConceptosListComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  respuesta: ResponseData<Concepto> = new ResponseData();
  error$: Observable<boolean> = new Observable();
  conceptoToDeleteId!: number | null;
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
    private store: Store<EntidadListState<Concepto>>,
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

    this.loadConceptos()

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

    this.store.select(SelectConceptosList.selectLoading).pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.loading = loading;
    });

    this.error$ = this.store.select(SelectConceptosList.selectErrorCarga);

    this.actionsSubject.pipe(filter(action => action.type === 'DeleteConceptoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.loadConceptos()
      });

    this.error$ = this.store.select(selectErrorCarga);

    this.store.select(SelectConceptosList.selectConceptosList).pipe(takeUntil(this.destroy$)).subscribe(respuesta => {
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

        this.transformedData = this.transformData(respuesta);

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

  onDeleteConcepto() {
    this.showConfirmationDialog = false;
    this.store.dispatch(ConceptosListActions.DeleteConcepto({ id: this.conceptoToDeleteId! }));
    this.loadConceptos()
  }

  applyFilterGlobal(event: Event, matchMode: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    this.globalFilter = { value, matchMode };
    this.loadConceptos()
  }

  showDeleteConfirmationDialog(id: number) {
    this.showConfirmationDialog = true;
    this.conceptoToDeleteId = id;
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

  // Función para transformar el objeto
  transformData(data: ResponseData<Concepto>) {
    return data.Items.map((item: any) => ({
      Id: item.Id,
      Nombre: item.Nombre,
      CategoriaId: item.Categoria.Id,
      CategoriaNombre: item.Categoria.Nombre,
      CategoriaDescripcion: item.Categoria.Descripcion,
    }));
  }

  public loadConceptos(): void {
    this.store.dispatch(ConceptosListActions.LoadingConceptos({ page: this.page, size: this.size, idUsuario: this.idUsuario }));
  }

  onExportar(opciones: ExportarExcelOpciones) {
    opciones.nombreArchivo = "Conceptos";
    this.store.dispatch(exportarExcel({ url: "concepto", opciones }));
  }

  onPageChange(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.size = event.rows;
    this.first = event.first; // Actualiza la página inicial
    this.loadConceptos();
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
