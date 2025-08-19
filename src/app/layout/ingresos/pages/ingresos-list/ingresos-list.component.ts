import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, map, takeUntil, Subject, filter } from 'rxjs';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as SelectIngresosList from '../../ngrx/selectors/ingresos-list.selectors'
import * as IngresosListActions from 'src/app/layout/ingresos/ngrx/actions/ingresos-list.actions';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { Ingreso } from 'src/app/shared/models/entidades/ingreso.model';
import { cloneDeep } from 'lodash';
import { PrimeNGConfig } from 'primeng/api';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import { EntidadListState } from 'src/app/shared/models/entidades/estados/entidadListState.model';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';
import { exportarExcel } from 'src/app/shared/excel/actions/excel.actions';
import { ExportarExcelOpciones } from 'src/app/shared/excel/exportar-excel-opciones.interface';

@Component({
  selector: 'app-ingresos-list',
  templateUrl: './ingresos-list.component.html',
  styleUrls: ['./ingresos-list.component.css']
})
export class IngresosListComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  respuesta: ResponseData<Ingreso> = new ResponseData();
  error$: Observable<boolean> = new Observable();
  ingresoToDeleteId!: number | null;
  showConfirmationDialog: boolean = false;
  searchValue: string = '';
  @ViewChild('dt') dt: Table | undefined;
  showErrorModal!: boolean;
  showSuccessModal!: boolean;
  errorMessage!: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  indiceActual = 0;
  cantidadPorPagina = 10;
  globalFilter: { value: string, matchMode: string } | null = null;
  isButtonDisabled: boolean = true;
  transformedData: any = [];
  page: number = 1;
  size: number = 10;
  totalRecords = 0;
  first = 0;
  totalPages: number = 1;
  idUsuario!: number;
  columnas: { label: string; value: string }[] = [];

  constructor(
    private store: Store<EntidadListState<Ingreso>>,
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

    this.loadIngresos()

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

    this.store.select(SelectIngresosList.selectLoading).pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.loading = loading;
    });

    this.actionsSubject.pipe(filter(action => action.type === 'DeleteIngresoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.loadIngresos()
      });

    this.error$ = this.store.select(SelectIngresosList.selectErrorCarga)

    this.store.select(SelectIngresosList.selectIngresosList).pipe(takeUntil(this.destroy$)).subscribe(respuesta => {
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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

  showDeleteConfirmationDialog(id: number): void {
    this.showConfirmationDialog = true;
    this.ingresoToDeleteId = id;
  }

  onDeleteIngreso(): void {
    this.showConfirmationDialog = false;
    this.store.dispatch(IngresosListActions.DeleteIngreso({ id: this.ingresoToDeleteId! }));
    this.loadIngresos()
  }

  goBack(): void {
    this.location.back();
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  applyFilterGlobal(event: Event, matchMode: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    this.globalFilter = { value, matchMode };

    this.loadIngresos()
  }

  getDateTimeLocalFormat(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year}`;
  }

  // Función para obtener el formato adecuado
  formatFecha(fechaStr: string): string {
    return this.getDateTimeLocalFormat(new Date(fechaStr));
  }

  onExportar(opciones: ExportarExcelOpciones) {
    opciones.nombreArchivo = "Ingresos";
    this.store.dispatch(exportarExcel({ url: "ingreso", opciones }));
  }

  // Función para transformar el objeto
  transformData(data: ResponseData<Ingreso>) {
    return data.Items.map((item: any) => ({
      Id: item.Id,
      Importe: item.Importe,
      Cliente: item.Cliente.Nombre,
      CategoriaNombre: item.Concepto.Categoria.Nombre,
      Concepto: item.Concepto.Nombre,
      Cuenta: item.Cuenta.Nombre,
      Descripcion: item.Descripcion,
      Fecha: this.formatFecha(item.Fecha),
      Persona: item.Persona.Nombre,
      FormaPago: item.FormaPago.Nombre,
      FechaCreacion: item.FechaCreacion
    }));
  }

  public loadIngresos(): void {
    this.store.dispatch(IngresosListActions.LoadingIngresos({ page: this.page, size: this.size, idUsuario: this.idUsuario }));
  }

  onPageChange(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.size = event.rows;
    this.first = event.first; // Actualiza la página inicial
    this.loadIngresos();
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
