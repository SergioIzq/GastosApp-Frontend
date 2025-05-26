import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, map, takeUntil, Subject, filter } from 'rxjs';
import { ActionsSubject, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as SelectGastosList from '../../ngrx/selectors/gastos-programados-list.selectors'
import * as GastosProgramadosListActions from 'src/app/layout/gastos/ngrx/actions/gastos-programados-list.actions';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { cloneDeep } from 'lodash';
import { PrimeNGConfig } from 'primeng/api';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { GastoProgramado } from 'src/app/shared/models/entidades/gastoProgramado.model';
import { EntidadListState } from 'src/app/shared/models/entidades/estados/entidadListState.model';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';

@Component({
  selector: 'app-gastos-programados-list',
  templateUrl: './gastos-programados-list.component.html',
  styleUrls: ['./gastos-programados-list.component.css']
})
export class GastosProgramadosListComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  respuesta: ResponseData<GastoProgramado> = new ResponseData();
  error$: Observable<boolean> = new Observable();
  gastoToDeleteId!: number | null;
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

  constructor(
    private store: Store<EntidadListState<GastoProgramado>>,
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

    this.loadGastos()

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

    this.store.select(SelectGastosList.selectLoading).pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.loading = loading;
    });

    this.actionsSubject.pipe(filter(action => action.type === 'DeleteGastoProgramadoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.loadGastos()
      });

    this.error$ = this.store.select(SelectGastosList.selectErrorCarga)

    this.store.select(SelectGastosList.selectGastosList).pipe(takeUntil(this.destroy$)).subscribe(respuesta => {
      if (respuesta) {
        // Clonar respuesta de manera profunda
        this.respuesta = cloneDeep(respuesta);
        this.totalRecords = this.respuesta.TotalRecords;
        this.totalPages = Math.ceil(this.totalRecords / this.size);
        this.transformedData = this.transformData(respuesta);

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
    this.gastoToDeleteId = id;
  }

  onDeleteGasto(): void {
    this.showConfirmationDialog = false;
    this.store.dispatch(GastosProgramadosListActions.DeleteGastoProgramado({ id: this.gastoToDeleteId! }));
    this.loadGastos()
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

    this.loadGastos()
  }

  getDateTimeLocalFormat(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year}`;
  }

  exportarAExcel(): void {
    const exportData = this.respuesta.Items.map(item => {
      return {
        'Persona': item.Persona,
        'FormaPago': item.FormaPago,
        'Proveedor': item.Proveedor,
        'Categoria': item.Concepto.Categoria,
        'Concepto': item.Concepto,
        'Cuenta': item.Cuenta,
        'Importe': item.Monto,
        'Descripcion': item.Descripcion,
      };
    });

    // Crear una nueva hoja de trabajo de Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Crear un nuevo libro de Excel y agregar la hoja de trabajo
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Gastos': worksheet },
      SheetNames: ['Gastos']
    };

    // Generar el archivo Excel en formato binario
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Crear un blob para el archivo
    const blob: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Guardar el archivo en la carpeta de descargas del usuario
    saveAs(blob, 'gastos-programados.xlsx');
  }

  // Función para transformar el objeto
  transformData(data: ResponseData<GastoProgramado>) {
    return data.Items.map((item: any) => ({
      Id: item.Id,
      Importe: item.Monto,
      Proveedor: item.Proveedor.Nombre,
      CategoriaNombre: item.Concepto.Categoria.Nombre,
      Concepto: item.Concepto.Nombre,
      Cuenta: item.Cuenta.Nombre,
      Persona: item.Persona.Nombre,
      FormaPago: item.FormaPago.Nombre,
      FechaEjecucion: new Date(item.FechaEjecucion.toString().replace('Z', '')),
      Frecuencia: item.Frecuencia,
      Activo: item.Activo
    }));
  }

  public loadGastos(): void {
    this.store.dispatch(GastosProgramadosListActions.LoadingGastosProgramados({ page: this.page, size: this.size, idUsuario: this.idUsuario }));
  }

  onPageChange(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.size = event.rows;
    this.first = event.first; // Actualiza la página inicial
    this.loadGastos();
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
}
