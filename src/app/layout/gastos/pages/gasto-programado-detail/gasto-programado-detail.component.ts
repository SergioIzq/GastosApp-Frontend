import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, takeUntil, of, filter, combineLatest } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActionsSubject, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import * as GastoProgramadoDetailActions from '../../ngrx/actions/gasto-programado-detail.actions'
import * as GastoProgramadoSelector from '../../ngrx/selectors/gasto-programado-detail.selectors'
import { Router } from '@angular/router';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { Persona } from 'src/app/shared/models/entidades/persona.model';
import { Proveedor } from 'src/app/shared/models/entidades/proveedor.model';
import { FormaPago } from 'src/app/shared/models/entidades/formaPago.model';
import { Categoria } from 'src/app/shared/models/entidades/categoria.model';
import { Concepto } from 'src/app/shared/models/entidades/concepto.model';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import { minAmountValidator } from 'src/app/shared/models/entidades/minAmountValidator.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GastoRespuesta } from 'src/app/shared/models/entidades/respuestas/gastos/gastoRespuesta.model';
import { ChangeDetectorRef } from '@angular/core';
import { GastoProgramadoByIdRespuesta } from 'src/app/shared/models/entidades/respuestas/gastos/gastoProgramadoByIdRespuesta.model';
import { GastoProgramadoDetailState } from 'src/app/shared/models/entidades/estados/gastoProgramadoDetailState.model';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';
import { GastoProgramado } from 'src/app/shared/models/entidades/gastoProgramado.model';
import { FrecuenciaEnum } from 'src/app/shared/models/entidades/enums/frecuencia.enum';

@Component({
  selector: 'app-gasto-programado-detail',
  templateUrl: './gasto-programado-detail.component.html',
  styleUrls: ['./gasto-programado-detail.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class GastoProgramadoDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  gastoId: number = 0;
  gastoPorId$!: Observable<GastoProgramadoByIdRespuesta | null>;
  loading: boolean = false;
  error$!: Observable<boolean>;
  detailGastoForm: FormGroup;
  originalGastoData!: GastoProgramado;
  isNewGasto: boolean = false;
  newGastoForm!: FormGroup;
  cuentas: Cuenta[] = [];
  personas: Persona[] = [];
  proveedores: Proveedor[] = [];
  formasPago: FormaPago[] = [];
  conceptos: Concepto[] = [];
  categorias: Categoria[] = [];
  filteredConceptos: Concepto[] = [];
  categoriaSeleccionada: Categoria | null = null;
  selectedCategoria: any | null = null;
  selectedConceptoId!: number;
  idUsuario: number | null = null;
  deshabilitarBoton: boolean = false;
  gastoRespuesta: GastoRespuesta = new GastoRespuesta();
  diasMes: { label: string, value: number }[] = [];
  diaMesSeleccionado!: number;
  diasSemana: { label: string, value: string }[] = [];
  diaSemanaSeleccionado!: string;
  frecuenciaGastoProgramado: { label: string; value: string; }[] = FrecuenciaEnum;
  diasSemanaMap!: { [key: string]: number };
  private _confirmationService: ConfirmationService = inject(ConfirmationService);
  private cdRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  constructor(
    private store: Store<GastoProgramadoDetailState>,
    private _store: Store<AuthState>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private actionsSubject: ActionsSubject
  ) {

    this.newGastoForm = this.fb.group({
      IdUsuario: [''],
      HangfireJobId: [''],
      Monto: ['', [Validators.required, Validators.pattern(/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/), minAmountValidator]],
      Descripcion: ['', [Validators.maxLength(200)]],
      Concepto: ['', [Validators.required]],
      Proveedor: ['', [Validators.required]],
      Persona: ['', [Validators.required]],
      FormaPago: ['', [Validators.required]],
      Cuenta: ['', [Validators.required]],
      Categoria: ['', [Validators.required]],
      Frecuencia: ['', [Validators.required]],
      Activo: [false],
      FechaEjecucion: [new Date(), [Validators.required]]
    });

    this.detailGastoForm = this.fb.group({
      Id: [''],
      IdUsuario: [''],
      HangfireJobId: [''],
      Monto: ['', [Validators.required, Validators.pattern(/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/), minAmountValidator]],
      Descripcion: ['', [Validators.maxLength(200)]],
      Concepto: ['', [Validators.required]],
      Categoria: ['', [Validators.required]],
      Proveedor: ['', [Validators.required]],
      Persona: ['', [Validators.required]],
      FormaPago: ['', [Validators.required]],
      Cuenta: ['', [Validators.required]],
      Frecuencia: ['', [Validators.required]],
      Activo: [false],
      FechaEjecucion: [new Date(), [Validators.required]]
    });

    this.diasMes = Array.from({ length: 31 }, (_, i) => {
      const num = i + 1;
      return { label: num.toString(), value: num };
    });

    this.diasSemana = [
      { label: 'Lunes', value: 'MONDAY' },
      { label: 'Martes', value: 'TUESDAY' },
      { label: 'Miércoles', value: 'WEDNESDAY' },
      { label: 'Jueves', value: 'THURSDAY' },
      { label: 'Viernes', value: 'FRIDAY' },
      { label: 'Sábado', value: 'SATURDAY' },
      { label: 'Domingo', value: 'SUNDAY' },
    ];

    this.diasSemanaMap = {
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
    };
  }

  ngOnInit(): void {
    this.newGastoForm.get('Concepto')?.disable();

    combineLatest([
      this.route.paramMap,
      this._store.select(selectUserId).pipe(filter(id => id > 0))
    ])
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(([params, idUsuario]) => {
        this.idUsuario = idUsuario;

        const idString = params.get('id');
        const id = parseInt(idString!, 10);
        this.gastoId = id;

        if (id === 0) {
          this.isNewGasto = true;
          this.gastoPorId$ = of(null);

          this.store.dispatch(GastoProgramadoDetailActions.GetNewGastoProgramado({ payload: idUsuario }));
        } else {
          this.isNewGasto = false;
          this.store.dispatch(GastoProgramadoDetailActions.GetGastoProgramado({ id }));
          this.gastoPorId$ = this.store.select(GastoProgramadoSelector.selectedGastoProgramadoSelector);
        }
      });

    this.actionsSubject.pipe(filter(action => action.type === 'CreateGastoProgramadoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        if (this.idUsuario) {
          this.router.navigate(['gastos/gasto-programado-detail', action.gastoProgramado.Item.Id])
          this.gastoId = action.gastoProgramado.Item.Id;
          this.isNewGasto = false;
          this.detailGastoForm.patchValue(this.newGastoForm.value);
          this.detailGastoForm.markAsPristine();
        }
      });

    this.actionsSubject.pipe(filter(action => action.type === 'GetNewGastoProgramadoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.gastoRespuesta = action.payload;

        if (this.gastoRespuesta) {
          this.cuentas = [...this.gastoRespuesta.ListaCuentas];
          this.formasPago = [...this.gastoRespuesta.ListaFormasPago];
          this.personas = [...this.gastoRespuesta.ListaPersonas];
          this.proveedores = [...this.gastoRespuesta.ListaProveedores];
          this.conceptos = [...this.gastoRespuesta.ListaConceptos];
          this.categorias = [...this.gastoRespuesta.ListaCategorias];
          this.cdRef.detectChanges();
        }
      })

    this.gastoPorId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((gastoByIdRespuesta: GastoProgramadoByIdRespuesta | null) => {
        if (gastoByIdRespuesta) {
          let gasto = gastoByIdRespuesta.GastoProgramadoById;
          this.cuentas = [...gastoByIdRespuesta.GastoRespuesta.ListaCuentas];
          this.formasPago = [...gastoByIdRespuesta.GastoRespuesta.ListaFormasPago];
          this.personas = [...gastoByIdRespuesta.GastoRespuesta.ListaPersonas];
          this.proveedores = [...gastoByIdRespuesta.GastoRespuesta.ListaProveedores];
          this.conceptos = [...gastoByIdRespuesta.GastoRespuesta.ListaConceptos];
          this.categorias = [...gastoByIdRespuesta.GastoRespuesta.ListaCategorias];
          this.cdRef.detectChanges();

          const monto = this.replaceDotsWithCommas(gasto.Monto);
          this.selectedCategoria = gasto.Concepto.Categoria.Id;
          this.selectedConceptoId = gasto.Concepto.Id;

          this.detailGastoForm.patchValue({
            ...gasto,            
            Monto: monto,
            Categoria: gasto.Concepto.Categoria,
          });
          this.originalGastoData = { ...gasto }

          this.filteredConceptos.push(gasto.Concepto);

          const fechaLocal = new Date(gasto.FechaEjecucion.toString().replace('Z', ''));
          
          // Verifica si la fecha está en UTC y ajusta según sea necesario
          if (gasto.Frecuencia === 'SEMANAL') {
            const dayIndex = fechaLocal.getUTCDay(); // Usamos getUTCDay para obtener el día de la semana en UTC (0=Domingo, ..., 6=Sábado)
            // Buscar la clave correspondiente en el map inverso
            const diaKey = Object.keys(this.diasSemanaMap).find(
              key => this.diasSemanaMap[key] === dayIndex
            );
            this.diaSemanaSeleccionado = diaKey!;
          }
          
          if (gasto.Frecuencia === 'MENSUAL') {
            this.diaMesSeleccionado = fechaLocal.getUTCDate(); // Usamos getUTCDate para obtener el día del mes en UTC
          }
          
          this.detailGastoForm.patchValue({
            FechaEjecucion: fechaLocal // Usar la hora ajustada
          });
          
          this.detailGastoForm.markAsPristine();
        }
      });

    this.store.select(GastoProgramadoSelector.selectLoading).pipe(takeUntil(this.destroy$)).subscribe((loading: boolean) => {
      this.loading = loading;
    });

    this.error$ = this.store.select(GastoProgramadoSelector.selectErrorCarga);

    this.detailGastoForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });

    this.newGastoForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit() {
    const formValue = this.isNewGasto ? this.newGastoForm.value : this.detailGastoForm.value;

    formValue.IdUsuario = this.idUsuario;

    let fechaLocal = formValue.FechaEjecucion;

    if (this.diaMesSeleccionado && formValue.Frecuencia == 'MENSUAL' && fechaLocal instanceof Date) {
      fechaLocal.setDate(this.diaMesSeleccionado);
    }

    if (this.diaSemanaSeleccionado && fechaLocal instanceof Date && formValue.Frecuencia == 'SEMANAL') {
      const diaTarget = this.diasSemanaMap[this.diaSemanaSeleccionado.toUpperCase()];
      const año = fechaLocal.getFullYear();
      const mes = fechaLocal.getMonth(); // 0-based
      let dia = 1;

      // Buscar el primer día del mes que caiga en el día de semana deseado
      while (true) {
        const posibleFecha = new Date(año, mes, dia);
        if (posibleFecha.getDay() === diaTarget) {
          // Copiar la hora y minuto original
          posibleFecha.setHours(fechaLocal.getHours(), fechaLocal.getMinutes(), 0, 0);
          fechaLocal = posibleFecha;
          break;
        }
        dia++;
      }
    }

    if (fechaLocal instanceof Date) {
      const offset = fechaLocal.getTimezoneOffset() * 60000;
      fechaLocal = new Date(fechaLocal.getTime() - offset);
    }

    const formattedImporte = this.replaceCommasWithDots(formValue.Monto);

    // Crea un nuevo objeto con el Monto formateado
    const formattedFormValue = {
      ...formValue,
      Monto: formattedImporte,
      FechaEjecucion: fechaLocal
    };

    if (this.isNewGasto) {
      this.showConfirmation('create', formattedFormValue);
    } else {
      this.showConfirmation('edit', formattedFormValue);
    }
  }

  private showConfirmation(actionType: string, formValue: any) {
    const headerMessage = actionType === 'create' ? 'Confirmar creación' : 'Confirmar edición';
    const detailMessage = actionType === 'create'
      ? '¿Está seguro que desea crear este registro?'
      : '¿Está seguro que desea editar este registro?';

    this._confirmationService.confirm({
      message: detailMessage,
      header: headerMessage,
      icon: 'pi pi-info-circle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        // Acción confirmada, proceder con el envío del formulario
        if (actionType === 'create') {
          this.createGasto(formValue);
        } else {
          this.updateGasto(formValue);
        }
      }
    });
  }

  private createGasto(formattedFormValue: any) {
    const newGastoData = { ...formattedFormValue };
    this.store.dispatch(GastoProgramadoDetailActions.CreateGastoProgramado({ payload: newGastoData }));
    this.deshabilitarBoton = true;
  }

  private updateGasto(formattedFormValue: any) {
    const updatedGastoData = { ...formattedFormValue };
    updatedGastoData.Id = this.gastoId;
    this.store.dispatch(GastoProgramadoDetailActions.UpdateGastoProgramado({ gastoProgramado: updatedGastoData }));
    this.detailGastoForm.markAsPristine();
    this.deshabilitarBoton = true;
  }

  private replaceCommasWithDots(value: any): any {
    if (typeof value === 'string') {
      value = value.replace(/,/g, '.');
      return value.replace(/\.(?=.*\.)/g, '');
    }
    return value;
  }

  private replaceDotsWithCommas(value: any): any {
    // Convertimos el valor a cadena
    let stringValue = value.toString();

    // Primero, eliminamos todos los puntos excepto el último
    stringValue = stringValue.replace(/\.(?=.*\.)/g, '');

    // Luego, reemplazamos el último punto por una coma
    stringValue = stringValue.replace(/\./g, ',');

    return stringValue;
  }

  goBack(): void {
    this.router.navigate(['gastos/gastos-programados-list'])
  }

  onCategoriaChange(event: any): void {
    const selectedCategoria = event.value;

    if (selectedCategoria) {
      this.selectedCategoria = selectedCategoria.Id;
      if (this.isNewGasto) {
        this.newGastoForm.get('Concepto')?.enable();
      } else {
        this.detailGastoForm.get('Concepto')?.enable();
      }
      this.filterConceptos();
    } else {
      this.selectedCategoria = null;
      this.filteredConceptos = [];
      if (this.isNewGasto) {
        this.newGastoForm.get('Concepto')?.disable();
        this.newGastoForm.patchValue({ Concepto: null });
      } else {
        this.detailGastoForm.patchValue({ Concepto: null });
        this.detailGastoForm.get('Concepto')?.disable();
      }
    }
  }

  private filterConceptos(): void {
    if (this.selectedCategoria !== null && this.conceptos) {
      // Filtra los conceptos por la categoría seleccionada
      this.filteredConceptos = this.conceptos.filter(concepto => {
        const conceptoCategoriaId = concepto.Categoria.Id;
        return conceptoCategoriaId === this.selectedCategoria;
      }).sort((a: Concepto, b: Concepto) =>
        a.Nombre.localeCompare(b.Nombre)
      );

    } else {
      // Si no hay categoría seleccionada, mostrar todos los conceptos
      this.filteredConceptos = this.conceptos ? this.conceptos.sort((a: Concepto, b: Concepto) =>
        a.Nombre.localeCompare(b.Nombre)
      ) : [];
    }
  }

  get frecuenciaSeleccionadaNewForm(): string {
    return this.newGastoForm.get('Frecuencia')?.value;
  }

  get frecuenciaSeleccionadaDetailForm(): string {
    return this.detailGastoForm.get('Frecuencia')?.value;
  }

  onDiaSemanaChange(nuevoValor: string, form: string) {
    this.diaSemanaSeleccionado = nuevoValor;
    this.actualizarEstadoBoton(form);
  }
  onDiaMesChange(nuevoValor: number, form: string) {
    this.diaMesSeleccionado = nuevoValor;
    this.actualizarEstadoBoton(form);
  }

  onFrecuenciaChange(nuevaFrecuencia: string, form: string) {
    if (form == 'new') {
      this.newGastoForm.get('Frecuencia')?.setValue(nuevaFrecuencia);
    } else {
      this.detailGastoForm.get('Frecuencia')?.setValue(nuevaFrecuencia);
    }
    this.actualizarEstadoBoton(form);
  }

  actualizarEstadoBoton(form: string) {
    let frecuencia;
    if (form == 'new') {
      frecuencia = this.frecuenciaSeleccionadaNewForm;
    } else {
      frecuencia = this.frecuenciaSeleccionadaDetailForm;
    }

    if (frecuencia === 'DIARIA') {
      this.deshabilitarBoton = false;
    } else if (frecuencia === 'SEMANAL') {
      this.deshabilitarBoton = !this.diaSemanaSeleccionado;
    } else if (frecuencia === 'MENSUAL') {
      this.deshabilitarBoton = !this.diaMesSeleccionado;
    } else {
      this.deshabilitarBoton = true;
    }    
  }
}