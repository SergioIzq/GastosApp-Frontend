import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, filter, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { selectErrorCarga } from '../../ngrx/selectors/categorias-list.selectors';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as SelectCategoriasList from '../../ngrx/selectors/categorias-list.selectors'
import * as CategoriasListActions from 'src/app/layout/categorias/ngrx/actions/categorias-list.actions';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/responseData.model';
import { Categoria } from 'src/app/shared/models/entidades/categoria.model';
import { cloneDeep } from 'lodash';
import { PrimeNGConfig } from 'primeng/api';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-categorias-list',
  templateUrl: './categorias-list.component.html',
  styleUrls: ['./categorias-list.component.css']
})
export class CategoriasListComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  respuesta: ResponseData<Categoria> = new ResponseData();
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
  page: number = 1;
  size: number = 10;
  totalRecords = 0;
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

    this.store.select(SelectCategoriasList.selectLoading).pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.loading = loading;
    });

    this.error$ = this.store.select(SelectCategoriasList.selectErrorCarga);

    this.actionsSubject.pipe(filter(action => action.type === 'DeleteCategoriaSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.loadCategorias()
      });

    this.error$ = this.store.select(selectErrorCarga);
    this.loadCategorias()

    this.store.select(SelectCategoriasList.selectCategoriasList).pipe(takeUntil(this.destroy$)).subscribe(respuesta => {
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

  onDeleteCategoria() {
    this.showConfirmationDialog = false;
    this.store.dispatch(CategoriasListActions.DeleteCategoria({ id: this.conceptoToDeleteId! }));
    this.loadCategorias()
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

  getDateTimeLocalFormat(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  // Función para obtener el formato adecuado
  formatFecha(fechaStr: string): string {
    return this.getDateTimeLocalFormat(new Date(fechaStr));
  }

  exportarAExcel(): void {
    const exportData = this.respuesta.Items.map(item => {
      return {
        'Nombre': item.Nombre,
        'Descripción': item.Descripcion
      };
    });
  
    // Crear una nueva hoja de trabajo de Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
  
    // Crear un nuevo libro de Excel y agregar la hoja de trabajo
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Categorias': worksheet },
      SheetNames: ['Categorias']
    };
  
    // Generar el archivo Excel en formato binario
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Crear un blob para el archivo
    const blob: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
    // Guardar el archivo en la carpeta de descargas del usuario
    saveAs(blob, 'categorias.xlsx');
  }

  onPageChange(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.size = event.rows;
    this.first = event.first;
    this.loadCategorias();
  }

  loadCategorias() {
    this.store.dispatch(CategoriasListActions.LoadingCategorias({ page: this.page, size: this.size, idUsuario: this.idUsuario }))
  }

}
