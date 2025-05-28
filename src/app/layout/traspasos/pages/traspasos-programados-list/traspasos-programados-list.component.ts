import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, takeUntil, Subject, filter } from 'rxjs';
import { ActionsSubject, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as SelectTraspasosList from '../../ngrx/selectors/traspasos-programados-list.selectors'
import * as TraspasosProgramadosListActions from 'src/app/layout/traspasos/ngrx/actions/traspasos-programados-list.actions';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { cloneDeep } from 'lodash';
import { PrimeNGConfig } from 'primeng/api';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { TraspasoProgramado } from 'src/app/shared/models/entidades/traspasoProgramado.model';
import { EntidadListState } from 'src/app/shared/models/entidades/estados/entidadListState.model';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';
import { ExportarExcelOpciones } from 'src/app/shared/excel/exportar-excel-opciones.interface';
import { exportarExcel } from 'src/app/shared/excel/actions/excel.actions';

@Component({
  selector: 'app-traspasos-programados-list',
  templateUrl: './traspasos-programados-list.component.html',
  styleUrls: ['./traspasos-programados-list.component.css']
})
export class TraspasosProgramadosListComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  respuesta: ResponseData<TraspasoProgramado> = new ResponseData();
  error$: Observable<boolean> = new Observable();
  traspasoToDeleteId!: number | null;
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
    private store: Store<EntidadListState<TraspasoProgramado>>,
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

    this.store.select(SelectTraspasosList.selectLoading).pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.loading = loading;
    });

    this.actionsSubject.pipe(filter(action => action.type === 'DeleteTraspasoProgramadoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.loadTraspasos()
      });

    this.error$ = this.store.select(SelectTraspasosList.selectErrorCarga)

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
    this.traspasoToDeleteId = id;
  }

  onDeleteTraspaso(): void {
    this.showConfirmationDialog = false;
    this.store.dispatch(TraspasosProgramadosListActions.DeleteTraspasoProgramado({ id: this.traspasoToDeleteId! }));
    this.loadTraspasos()
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

    this.loadTraspasos()
  }

  getDateTimeLocalFormat(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year}`;
  }

  onExportar(opciones: ExportarExcelOpciones) {
    opciones.nombreArchivo = "Traspasos Programados";
    this.store.dispatch(exportarExcel({ url: "traspasoProgramado", opciones }));
  }

  transformData(data: ResponseData<TraspasoProgramado>) {
    return data.Items.map((item: any) => ({
      Id: item.Id,
      Importe: item.Importe,
      CuentaOrigen: item.CuentaOrigen.Nombre,
      SaldoCuentaOrigen: item.SaldoCuentaOrigen,
      CuentaDestino: item.CuentaDestino.Nombre,
      SaldoCuentaDestino: item.SaldoCuentaDestino,
      FechaEjecucion: new Date(item.FechaEjecucion.toString().replace('Z', '')),
      Frecuencia: item.Frecuencia,
      Activo: item.Activo
    }));
  }

  public loadTraspasos(): void {
    this.store.dispatch(TraspasosProgramadosListActions.LoadingTraspasosProgramados({ page: this.page, size: this.size, idUsuario: this.idUsuario }));
  }

  onPageChange(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.size = event.rows;
    this.first = event.first; // Actualiza la página inicial
    this.loadTraspasos();
  }

  capitalizarPrimeraLetra(texto: string | null): string {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1);
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
