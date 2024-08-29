import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, takeUntil, Subject, filter } from 'rxjs';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Location } from '@angular/common';
import * as SelectResumenList from '../../ngrx/selectors/resumen-list.selectors'
import * as ResumenListActions from 'src/app/layout/resumen/ngrx/actions/resumen-list.actions';
import { Table } from 'primeng/table';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  Chart,
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);
import { ResumenIngresosResponse } from 'src/app/shared/models/entidades/resumenIngresosResponse.model';
import { ResumenGastosResponse } from 'src/app/shared/models/entidades/ResumenGastosResumen.model';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';

@Component({
  selector: 'app-resumen-list',
  templateUrl: './resumen-list.component.html',
  styleUrls: ['./resumen-list.component.css']
})
export class ResumenListComponent implements OnInit, OnDestroy, AfterViewInit {

  gastosFormatted: any = null;
  ingresosFormatted: any = null;
  loading: boolean = false;
  respuestaIngresos: ResumenIngresosResponse = new ResumenIngresosResponse();
  respuestaGastos: ResumenGastosResponse = new ResumenGastosResponse();
  totalRecords: number = 0;
  error$: Observable<boolean> = new Observable();
  ingresoToDeleteId: number | null = null;
  showConfirmationDialog: boolean = false;
  searchValue: string = '';
  @ViewChild('dt') dt: Table | undefined;
  errorMessage!: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  indiceActual = 0;
  cantidadPorPagina = 10;
  globalFilter: { value: string, matchMode: string } | null = null;
  fechaInicio: Date | null = new Date();
  fechaFin: Date | null = new Date();
  dataPie: any = [];
  optionsPie: any = [];
  options: any;
  ingresosMonto: any = null;
  isButtonDisabled: boolean = true;
  pageGastos: number = 1;
  sizeGastos: number = 10;
  totalGastosRecords = 0;
  pageIngresos: number = 1;
  sizeIngresos: number = 10;
  totalIngresosRecords = 0;
  first = 0;
  beneficiosTotales: number | null = null;
  mostrarContenido: boolean = false;
  idUsuario!: number;
  chart: Chart<'pie', any, any> | undefined;
  showChart: boolean = false;

  constructor(
    private store: Store<AppState>,
    private location: Location,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private actionsSubject: ActionsSubject
  ) {

    this.initGlobalChart();

  }

  ngOnInit(): void {

    this.store.select(selectUserId).pipe(takeUntil(this.destroy$)).subscribe((idUsuario: number) => {
      this.idUsuario = idUsuario;
    });


    this.actionsSubject.pipe(filter(action => action.type === '[Resumen] Load Ingresos Success'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.store.dispatch(ResumenListActions.LoadGastos({
          fechaInicio: this.fechaInicio,
          page: 1,
          size: 10,
          fechaFin: this.fechaFin,
          idUsuario: this.idUsuario
        }));
      });

    this.actionsSubject.pipe(filter(action => action.type === '[Resumen] Load Gastos Success'), takeUntil(this.destroy$))
      .subscribe((action: any) => {

        this.updateGlobalChart(this.respuestaIngresos.IngresosTotales, this.respuestaGastos.GastosTotales)
        this.beneficiosTotales = this.respuestaIngresos.IngresosTotales - this.respuestaGastos.GastosTotales;
        this.showChart = true;
      });

    this.primengConfig.setTranslation({
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      firstDayOfWeek: 1,
      today: 'Hoy',
      clear: 'Reiniciar',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Sm'
    });

    this.store.select(SelectResumenList.selectLoading).pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.loading = loading;
    });

    this.error$ = this.store.select(SelectResumenList.selectErrorCarga)

  }

  ngAfterViewInit(): void {
    this.initGlobalChart();
  }

  ngOnDestroy(): void {

    this.limpiarFiltros()

    this.showChart = false;
    this.destroy$.next(true);
    this.destroy$.complete()

    this.destroy$.unsubscribe();
    // Si existe un gráfico, destrúyelo y libera recursos
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
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

  goBack(): void {
    this.location.back();
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
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

  get puedeBuscar(): boolean {
    // Puede buscar solo si ambas fechas están definidas
    return !(this.fechaInicio && this.fechaFin);
  }

  limpiarFiltros() {
    // Restablece las fechas a null
    this.fechaInicio = null;
    this.fechaFin = null;
    this.mostrarContenido = false;
    this.isButtonDisabled = true;
    this.showChart = false;
  }

  aplicarFiltrosFecha() {
    if (this.fechaInicio && this.fechaFin) {

      this.fechaInicio = new Date(this.fechaInicio.getFullYear(), this.fechaInicio.getMonth(), this.fechaInicio.getDate());

      // Normalizar fechaFin a las 23:59:59
      this.fechaFin = new Date(this.fechaFin.getFullYear(), this.fechaFin.getMonth(), this.fechaFin.getDate(), 23, 59, 59);

      if (this.fechaInicio <= this.fechaFin) {

        this.store.dispatch(ResumenListActions.LoadIngresos({
          fechaInicio: this.fechaInicio,
          page: 1,
          size: 10,
          fechaFin: this.fechaFin,
          idUsuario: this.idUsuario
        }));

        this.store.select(SelectResumenList.selectListaGastos).pipe(takeUntil(this.destroy$)).subscribe(respuesta => {
          if (respuesta) {
            this.respuestaGastos = respuesta;
            this.gastosFormatted = this.transformGastos(this.respuestaGastos.Gastos);

            this.totalGastosRecords = this.respuestaGastos.GastosTotalCount

          }
        });


        this.store.select(SelectResumenList.selectListaIngresos).pipe(takeUntil(this.destroy$)).subscribe(respuesta => {
          if (respuesta) {
            this.respuestaIngresos = respuesta;
            this.ingresosFormatted = this.transformIngresos(this.respuestaIngresos.Ingresos);


            this.totalIngresosRecords = this.respuestaIngresos.IngresosTotalCount
            if (this.respuestaGastos.GastosTotales) {

              this.isButtonDisabled = false;
            }
            this.mostrarContenido = true;
            this.updateGlobalChart(this.respuestaIngresos.IngresosTotales, this.respuestaGastos.GastosTotales)

          }
        });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "La fecha de inicio debe ser igual o menor a la fecha de fin", life: 3000 });
      }

    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Seleccione las dos fechas", life: 3000 });
    }
  }

  isRangoDeFechasPorAnio(fechaInicio: Date, fechaFin: Date): boolean {
    return fechaInicio.getFullYear() !== fechaFin.getFullYear();
  }

  exportarAExcel(): void {
    // Formatear los datos de ingresos y gastos
    const ingresosData = this.ingresosFormatted.map((item: any) => ({
      TipoOperacion: 'Ingreso',
      Fecha: item.Fecha,
      Persona: item.Persona || '',
      FormaPago: item.FormaPago || '',
      Cliente: item.Cliente || '',
      Proveedor: '',
      Categoria: item.CategoriaNombre || '',
      Concepto: item.Concepto || '',
      Cuenta: item.Cuenta || '',
      Importe: `+${item.Importe}`,
      IngresosTotales: ''
    }));

    const gastosData = this.gastosFormatted.map((item: any) => ({
      TipoOperacion: 'Gasto',
      Fecha: item.Fecha,
      Persona: item.Persona || '',
      FormaPago: item.FormaPago || '',
      Cliente: '',
      Proveedor: item.Proveedor || '',
      Categoria: item.CategoriaNombre || '',
      Concepto: item.Concepto || '',
      Cuenta: item.Cuenta || '',
      Importe: `-${item.Importe}`,
      GastosTotales: ''
    }));

    // Combinar los datos en un solo array
    const resumenData = [...ingresosData, ...gastosData];

    // Añadir una fila con los totales (sin las propiedades adicionales)
    resumenData.push({
      TipoOperacion: 'Totales',
      Fecha: '',
      Persona: '',
      FormaPago: '',
      Cliente: '',
      Proveedor: '',
      Categoria: '',
      Concepto: '',
      Cuenta: '',
      Importe: '',
      IngresosTotales: `+${this.respuestaIngresos.IngresosTotales}`,
      GastosTotales: `+${this.respuestaGastos.GastosTotales}`,
      Beneficio: `+${this.beneficiosTotales}`

    });

    // Crear la hoja de Excel con los datos formateados
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(resumenData);

    // Crear un nuevo libro de Excel y agregar la hoja de trabajo
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Resumen': worksheet },
      SheetNames: ['Resumen']
    };

    // Generar el archivo Excel en formato binario
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Crear un blob para el archivo
    const blob: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Guardar el archivo en la carpeta de descargas del usuario
    saveAs(blob, 'resumen.xlsx');
  }

  transformGastos(data: any): any[] {
    return data.map((item: any) => ({
      Id: item.Id,
      Importe: item.Monto,
      Proveedor: item.Proveedor ? item.Proveedor.Nombre : null,
      CategoriaNombre: item.Concepto ? item.Concepto.Categoria ? item.Concepto.Categoria.Nombre : null : null,
      Concepto: item.Concepto ? item.Concepto.Nombre : null,
      Cuenta: item.Cuenta ? item.Cuenta.Nombre : null,
      Descripcion: item.Descripcion,
      Fecha: this.formatFecha(item.Fecha),
      Persona: item.Persona ? item.Persona.Nombre : null,
      FormaPago: item.FormaPago ? item.FormaPago.Nombre : null
    }));
  }

  transformIngresos(data: any): any[] {
    return data.map((item: any) => ({
      Id: item.Id,
      Importe: item.Monto,
      Cliente: item.Cliente ? item.Cliente.Nombre : null,
      CategoriaNombre: item.Concepto ? item.Concepto.Categoria ? item.Concepto.Categoria.Nombre : null : null,
      Concepto: item.Concepto ? item.Concepto.Nombre : null,
      Cuenta: item.Cuenta ? item.Cuenta.Nombre : null,
      Descripcion: item.Descripcion,
      Fecha: this.formatFecha(item.Fecha),
      Persona: item.Persona ? item.Persona.Nombre : null,
      FormaPago: item.FormaPago ? item.FormaPago.Nombre : null
    }));
  }


  onPageChangeGasto(event: any) {
    this.pageGastos = Math.floor(event.first / event.rows) + 1;
    this.sizeGastos = event.rows;

    // Despachar la acción para cargar gastos
    this.store.dispatch(ResumenListActions.LoadGastos({
      page: this.pageGastos,
      size: this.sizeGastos,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      idUsuario: this.idUsuario
    }));
  }

  onPageChangeIngresos(event: any) {
    this.pageIngresos = Math.floor(event.first / event.rows) + 1;
    this.sizeIngresos = event.rows;

    // Despachar la acción para cargar ingresos
    this.store.dispatch(ResumenListActions.LoadIngresos({
      page: this.pageIngresos,
      size: this.sizeIngresos,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      idUsuario: this.idUsuario

    }));
  }

  initGlobalChart() {
    const canvas = document.getElementById('pieChart') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Ingresos', 'Gastos'],
            datasets: [{
              data: [0, 0], // Inicialmente vacío
              backgroundColor: ['rgba(0,128,0,0.6)', 'rgba(255,0,0,0.6)'],
              borderColor: ['rgba(0,128,0,1)', 'rgba(255,0,0,1)'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem: any) {
                    return tooltipItem.label + ': ' + tooltipItem.raw + ' €';
                  }
                }
              }
            }
          }
        });
      } 
    }
  }


  updateGlobalChart(totalIngresos: number, totalGastos: number) {
    if (this.chart) {
      this.chart.data.datasets[0].data = [totalIngresos, totalGastos];
      this.chart.update(); // Actualizar el gráfico para reflejar los nuevos datos
    }
  }


}
