import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, takeUntil, of, filter, combineLatest } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActionsSubject, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import * as IngresoProgramadoDetailActions from '../../ngrx/actions/ingreso-programado-detail.actions'
import * as IngresoProgramadoSelector from '../../ngrx/selectors/ingreso-programado-detail.selectors'
import { Router } from '@angular/router';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { Persona } from 'src/app/shared/models/entidades/persona.model';
import { FormaPago } from 'src/app/shared/models/entidades/formaPago.model';
import { Categoria } from 'src/app/shared/models/entidades/categoria.model';
import { Concepto } from 'src/app/shared/models/entidades/concepto.model';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import { minAmountValidator } from 'src/app/shared/models/entidades/minAmountValidator.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IngresoRespuesta } from 'src/app/shared/models/entidades/respuestas/ingresos/ingresoRespuesta.model';
import { ChangeDetectorRef } from '@angular/core';
import { IngresoProgramadoByIdRespuesta } from 'src/app/shared/models/entidades/respuestas/ingresos/ingresoProgramadoByIdRespuesta.model';
import { IngresoProgramadoDetailState } from 'src/app/shared/models/entidades/estados/ingresoProgramadoDetailState.model';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';
import { IngresoProgramado } from 'src/app/shared/models/entidades/ingresoProgramado.model';
import { Cliente } from 'src/app/shared/models/entidades/cliente.model';
import { FrecuenciaEnum } from 'src/app/shared/models/entidades/enums/frecuencia.enum';

@Component({
  selector: 'app-ingreso-programado-detail',
  templateUrl: './ingreso-programado-detail.component.html',
  styleUrls: ['./ingreso-programado-detail.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class IngresoProgramadoDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  ingresoId: number = 0;
  ingresoPorId$!: Observable<IngresoProgramadoByIdRespuesta | null>;
  loading: boolean = false;
  error$!: Observable<boolean>;
  detailIngresoForm: FormGroup;
  originalIngresoData!: IngresoProgramado;
  isNewIngreso: boolean = false;
  newIngresoForm!: FormGroup;
  cuentas: Cuenta[] = [];
  personas: Persona[] = [];
  clientes: Cliente[] = [];
  formasPago: FormaPago[] = [];
  conceptos: Concepto[] = [];
  categorias: Categoria[] = [];
  filteredConceptos: Concepto[] = [];
  categoriaSeleccionada: Categoria | null = null;
  selectedCategoria: any | null = null;
  selectedConceptoId!: number;
  idUsuario: number | null = null;
  deshabilitarBoton: boolean = false;
  ingresoRespuesta: IngresoRespuesta = new IngresoRespuesta();
  diasMes: { label: string, value: number }[] = [];
  diaMesSeleccionado!: number;
  diasSemana: { label: string, value: string }[] = [];
  diaSemanaSeleccionado!: string;
  frecuenciaIngresoProgramado: { label: string; value: string; }[] = FrecuenciaEnum;
  diasSemanaMap!: { [key: string]: number };
  private _confirmationService: ConfirmationService = inject(ConfirmationService);
  private cdRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  constructor(
    private store: Store<IngresoProgramadoDetailState>,
    private _store: Store<AuthState>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private actionsSubject: ActionsSubject
  ) {

    this.newIngresoForm = this.fb.group({
      IdUsuario: [''],
      HangfireJobId: [''],
      Monto: ['', [Validators.required, Validators.pattern(/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/), minAmountValidator]],
      Descripcion: ['', [Validators.maxLength(200)]],
      Concepto: ['', [Validators.required]],
      Cliente: ['', [Validators.required]],
      Persona: ['', [Validators.required]],
      FormaPago: ['', [Validators.required]],
      Cuenta: ['', [Validators.required]],
      Categoria: ['', [Validators.required]],
      Frecuencia: ['', [Validators.required]],
      Activo: [false],
      FechaEjecucion: [new Date(), [Validators.required]]
    });

    this.detailIngresoForm = this.fb.group({
      Id: [''],
      IdUsuario: [''],
      HangfireJobId: [''],
      Monto: ['', [Validators.required, Validators.pattern(/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/), minAmountValidator]],
      Descripcion: ['', [Validators.maxLength(200)]],
      Concepto: ['', [Validators.required]],
      Categoria: ['', [Validators.required]],
      Cliente: ['', [Validators.required]],
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
    this.newIngresoForm.get('Concepto')?.disable();

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
        this.ingresoId = id;

        if (id === 0) {
          this.isNewIngreso = true;
          this.ingresoPorId$ = of(null);
          this.newIngresoForm.patchValue({
            Fecha: new Date().toLocaleDateString('es-ES')
          });

          this.store.dispatch(IngresoProgramadoDetailActions.GetNewIngresoProgramado({ payload: idUsuario }));
        } else {
          this.isNewIngreso = false;
          this.store.dispatch(IngresoProgramadoDetailActions.GetIngresoProgramado({ id }));
          this.ingresoPorId$ = this.store.select(IngresoProgramadoSelector.selectedIngresoProgramadoSelector);
        }
      });

    this.actionsSubject.pipe(filter(action => action.type === 'CreateIngresoProgramadoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        if (this.idUsuario) {
          this.router.navigate(['ingresos/ingreso-programado-detail', action.ingresoProgramado.Item.Id])
          this.ingresoId = action.ingresoProgramado.Item.Id;
          this.isNewIngreso = false;
          this.detailIngresoForm.patchValue(this.newIngresoForm.value);
          this.detailIngresoForm.markAsPristine();
        }
      });

    this.actionsSubject.pipe(filter(action => action.type === 'GetNewIngresoProgramadoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.ingresoRespuesta = action.payload;

        if (this.ingresoRespuesta) {
          this.cuentas = [...this.ingresoRespuesta.ListaCuentas];
          this.formasPago = [...this.ingresoRespuesta.ListaFormasPago];
          this.personas = [...this.ingresoRespuesta.ListaPersonas];
          this.clientes = [...this.ingresoRespuesta.ListaClientes];
          this.conceptos = [...this.ingresoRespuesta.ListaConceptos];
          this.categorias = [...this.ingresoRespuesta.ListaCategorias];
          this.cdRef.detectChanges();
        }
      })

    this.ingresoPorId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((ingresoByIdRespuesta: IngresoProgramadoByIdRespuesta | null) => {
        if (ingresoByIdRespuesta) {
          let ingreso = ingresoByIdRespuesta.IngresoProgramadoById;
          this.cuentas = [...ingresoByIdRespuesta.IngresoRespuesta.ListaCuentas];
          this.formasPago = [...ingresoByIdRespuesta.IngresoRespuesta.ListaFormasPago];
          this.personas = [...ingresoByIdRespuesta.IngresoRespuesta.ListaPersonas];
          this.clientes = [...ingresoByIdRespuesta.IngresoRespuesta.ListaClientes];
          this.conceptos = [...ingresoByIdRespuesta.IngresoRespuesta.ListaConceptos];
          this.categorias = [...ingresoByIdRespuesta.IngresoRespuesta.ListaCategorias];
          this.cdRef.detectChanges();

          const monto = this.replaceDotsWithCommas(ingreso.Monto);
          this.selectedCategoria = ingreso.Concepto.Categoria.Id;
          this.selectedConceptoId = ingreso.Concepto.Id;

          this.detailIngresoForm.patchValue({
            ...ingreso,
            Monto: monto,
            Categoria: ingreso.Concepto.Categoria,
          });

          this.originalIngresoData = { ...ingreso }

          this.filteredConceptos.push(ingreso.Concepto);

          const fechaLocal = new Date(ingreso.FechaEjecucion.toString().replace('Z', ''));

          // Verifica si la fecha está en UTC y ajusta según sea necesario
          if (ingreso.Frecuencia === 'SEMANAL') {
            const dayIndex = fechaLocal.getUTCDay(); // Usamos getUTCDay para obtener el día de la semana en UTC (0=Domingo, ..., 6=Sábado)
            // Buscar la clave correspondiente en el map inverso
            const diaKey = Object.keys(this.diasSemanaMap).find(
              key => this.diasSemanaMap[key] === dayIndex
            );
            this.diaSemanaSeleccionado = diaKey!;
          }

          if (ingreso.Frecuencia === 'MENSUAL') {
            this.diaMesSeleccionado = fechaLocal.getUTCDate(); // Usamos getUTCDate para obtener el día del mes en UTC
          }

          this.detailIngresoForm.patchValue({
            FechaEjecucion: fechaLocal // Usar la hora ajustada
          });

          this.detailIngresoForm.markAsPristine();
        }
      });

    this.store.select(IngresoProgramadoSelector.selectLoading).pipe(takeUntil(this.destroy$)).subscribe((loading: boolean) => {
      this.loading = loading;
    });

    this.error$ = this.store.select(IngresoProgramadoSelector.selectErrorCarga);

    this.detailIngresoForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });

    this.newIngresoForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit() {
    const formValue = this.isNewIngreso ? this.newIngresoForm.value : this.detailIngresoForm.value;

    formValue.IdUsuario = this.idUsuario;
console.log(formValue)
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
    console.log(formValue)

    if (this.isNewIngreso) {
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
          this.createIngreso(formValue);
        } else {
          this.updateIngreso(formValue);
        }
      }
    });
  }

  private createIngreso(formattedFormValue: any) {
    const newIngresoData = { ...formattedFormValue };
    console.log(newIngresoData)
    this.store.dispatch(IngresoProgramadoDetailActions.CreateIngresoProgramado({ payload: newIngresoData }));
    this.deshabilitarBoton = true;
  }

  private updateIngreso(formattedFormValue: any) {
    const updatedIngresoData = { ...formattedFormValue };
    updatedIngresoData.Id = this.ingresoId;
    this.store.dispatch(IngresoProgramadoDetailActions.UpdateIngresoProgramado({ ingresoProgramado: updatedIngresoData }));
    this.detailIngresoForm.markAsPristine();
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
    this.router.navigate(['ingresos/ingresos-programados-list'])
  }

  onCategoriaChange(event: any): void {
    const selectedCategoria = event.value;

    if (selectedCategoria) {
      this.selectedCategoria = selectedCategoria.Id;
      if (this.isNewIngreso) {
        this.newIngresoForm.get('Concepto')?.enable();
      } else {
        this.detailIngresoForm.get('Concepto')?.enable();
      }
      this.filterConceptos();
    } else {
      this.selectedCategoria = null;
      this.filteredConceptos = [];
      if (this.isNewIngreso) {
        this.newIngresoForm.get('Concepto')?.disable();
        this.newIngresoForm.patchValue({ Concepto: null });
      } else {
        this.detailIngresoForm.patchValue({ Concepto: null });
        this.detailIngresoForm.get('Concepto')?.disable();
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
    return this.newIngresoForm.get('Frecuencia')?.value;
  }

  get frecuenciaSeleccionadaDetailForm(): string {
    return this.detailIngresoForm.get('Frecuencia')?.value;
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
      this.newIngresoForm.get('Frecuencia')?.setValue(nuevaFrecuencia);
    } else {
      this.detailIngresoForm.get('Frecuencia')?.setValue(nuevaFrecuencia);
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
