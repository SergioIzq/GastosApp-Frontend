import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, takeUntil, of, filter, combineLatest } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActionsSubject, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import * as TraspasoProgramadoDetailActions from '../../ngrx/actions/traspaso-programado-detail.actions'
import * as TraspasoProgramadoSelector from '../../ngrx/selectors/traspaso-programado-detail.selectors'
import { Router } from '@angular/router';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { Persona } from 'src/app/shared/models/entidades/persona.model';
import { FormaPago } from 'src/app/shared/models/entidades/formaPago.model';
import { Categoria } from 'src/app/shared/models/entidades/categoria.model';
import { Concepto } from 'src/app/shared/models/entidades/concepto.model';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import { minAmountValidator } from 'src/app/shared/models/entidades/minAmountValidator.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ChangeDetectorRef } from '@angular/core';
import { TraspasoProgramadoByIdRespuesta } from 'src/app/shared/models/entidades/respuestas/traspasos/traspasoProgramadoByIdRespuesta.model';
import { TraspasoProgramadoDetailState } from 'src/app/shared/models/entidades/estados/traspasoProgramadoDetailState.model';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';
import { TraspasoProgramado } from 'src/app/shared/models/entidades/traspasoProgramado.model';
import { Cliente } from 'src/app/shared/models/entidades/cliente.model';
import { FrecuenciaEnum } from 'src/app/shared/models/entidades/enums/frecuencia.enum';

@Component({
  selector: 'app-traspaso-programado-detail',
  templateUrl: './traspaso-programado-detail.component.html',
  styleUrls: ['./traspaso-programado-detail.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class TraspasoProgramadoDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  traspasoId: number = 0;
  traspasoPorId$!: Observable<TraspasoProgramadoByIdRespuesta | null>;
  loading: boolean = false;
  error$!: Observable<boolean>;
  detailTraspasoForm: FormGroup;
  originalTraspasoData!: TraspasoProgramado;
  isNewTraspaso: boolean = false;
  newTraspasoForm!: FormGroup;
  cuentas: Cuenta[] = [];
  idUsuario: number | null = null;
  deshabilitarBoton: boolean = false;
  diasMes: { label: string, value: number }[] = [];
  diaMesSeleccionado!: number;
  diasSemana: { label: string, value: string }[] = [];
  diaSemanaSeleccionado!: string;
  frecuenciaTraspasoProgramado: { label: string; value: string; }[] = FrecuenciaEnum;
  diasSemanaMap!: { [key: string]: number };
  filteredCuentasDestinos: Cuenta[] = [];
  filteredCuentasOrigen: Cuenta[] = [];
  private _confirmationService: ConfirmationService = inject(ConfirmationService);
  private cdRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  constructor(
    private store: Store<TraspasoProgramadoDetailState>,
    private _store: Store<AuthState>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private actionsSubject: ActionsSubject
  ) {

    this.newTraspasoForm = this.fb.group({
      IdUsuario: [''],
      HangfireJobId: [''],
      CuentaOrigen: ['', [Validators.required]],
      CuentaDestino: ['', [Validators.required]],
      Importe: ['', [Validators.required, Validators.pattern(/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/), minAmountValidator]],
      Descripcion: ['', [Validators.maxLength(200)]],
      Frecuencia: ['', [Validators.required]],
      Activo: [false],
      FechaEjecucion: [new Date(), [Validators.required]]
    });

    this.detailTraspasoForm = this.fb.group({
      Id: [''],
      IdUsuario: [''],
      HangfireJobId: [''],
      CuentaOrigen: ['', [Validators.required]],
      CuentaDestino: ['', [Validators.required]],
      Importe: ['', [Validators.required, Validators.pattern(/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/), minAmountValidator]],
      Descripcion: ['', [Validators.maxLength(200)]],
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
        this.traspasoId = id;

        if (id === 0) {
          this.isNewTraspaso = true;
          this.traspasoPorId$ = of(null);
          this.newTraspasoForm.patchValue({
            Fecha: new Date().toLocaleDateString('es-ES')
          });

          this.store.dispatch(TraspasoProgramadoDetailActions.GetNewTraspasoProgramado({ payload: idUsuario }));
        } else {
          this.isNewTraspaso = false;
          this.store.dispatch(TraspasoProgramadoDetailActions.GetTraspasoProgramado({ id }));
          this.traspasoPorId$ = this.store.select(TraspasoProgramadoSelector.selectedTraspasoProgramadoSelector);
        }
      });

    this.actionsSubject.pipe(filter(action => action.type === 'CreateTraspasoProgramadoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        if (this.idUsuario) {
          this.router.navigate(['traspasos/traspaso-programado-detail', action.traspasoProgramado.Item.Id])
          this.traspasoId = action.traspasoProgramado.Item.Id;
          this.isNewTraspaso = false;
          this.detailTraspasoForm.patchValue(this.newTraspasoForm.value);
          this.detailTraspasoForm.markAsPristine();
        }
      });

    this.actionsSubject.pipe(filter(action => action.type === 'GetNewTraspasoProgramadoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        if (action) {
          this.cuentas = [...action.payload];
          this.filteredCuentasDestinos = this.cuentas.slice().sort((a, b) => a.Nombre.localeCompare(b.Nombre));
          this.filteredCuentasOrigen = this.cuentas.slice().sort((a, b) => a.Nombre.localeCompare(b.Nombre));

          if (!this.isNewTraspaso) {
            this.filterInitialCuentas();
          }
        }
      });

    this.traspasoPorId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((traspasoRespuesta: TraspasoProgramadoByIdRespuesta | null) => {
        if (traspasoRespuesta) {
          let traspaso = traspasoRespuesta.TraspasoProgramadoById;
          this.cuentas = traspasoRespuesta.ListaCuentas;

          this.detailTraspasoForm.patchValue({
            ...traspaso,
            Importe: this.replaceDotsWithCommas(traspaso.Importe),
          });

          this.originalTraspasoData = { ...traspaso };

          this.onCuentaOrigenChange({ value: traspaso.CuentaOrigen });
          this.onCuentaDestinoChange({ value: traspaso.CuentaDestino });

          const fechaLocal = new Date(traspaso.FechaEjecucion.toString().replace('Z', ''));

          // Verifica si la fecha está en UTC y ajusta según sea necesario
          if (traspaso.Frecuencia === 'SEMANAL') {
            const dayIndex = fechaLocal.getUTCDay(); // Usamos getUTCDay para obtener el día de la semana en UTC (0=Domingo, ..., 6=Sábado)
            // Buscar la clave correspondiente en el map inverso
            const diaKey = Object.keys(this.diasSemanaMap).find(
              key => this.diasSemanaMap[key] === dayIndex
            );
            this.diaSemanaSeleccionado = diaKey!;
          }

          if (traspaso.Frecuencia === 'MENSUAL') {
            this.diaMesSeleccionado = fechaLocal.getUTCDate(); // Usamos getUTCDate para obtener el día del mes en UTC
          }

          this.detailTraspasoForm.patchValue({
            FechaEjecucion: fechaLocal // Usar la hora ajustada
          });

          this.detailTraspasoForm.markAsPristine();
        }
      });

    this.store.select(TraspasoProgramadoSelector.selectLoading).pipe(takeUntil(this.destroy$)).subscribe((loading: boolean) => {
      this.loading = loading;
    });

    this.error$ = this.store.select(TraspasoProgramadoSelector.selectErrorCarga);

    this.detailTraspasoForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });

    this.newTraspasoForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit() {
    const formValue = this.isNewTraspaso ? this.newTraspasoForm.value : this.detailTraspasoForm.value;

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

    if (this.isNewTraspaso) {
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
    document.body.classList.add('blur-background');

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
          this.createTraspaso(formValue);
        } else {
          this.updateTraspaso(formValue);
        }
      }
    });
  }

  private createTraspaso(formattedFormValue: any) {
    const newTraspasoData = { ...formattedFormValue };
    console.log(newTraspasoData)
    this.store.dispatch(TraspasoProgramadoDetailActions.CreateTraspasoProgramado({ payload: newTraspasoData }));
    this.deshabilitarBoton = true;
  }

  private updateTraspaso(formattedFormValue: any) {
    const updatedTraspasoData = { ...formattedFormValue };
    updatedTraspasoData.Id = this.traspasoId;
    this.store.dispatch(TraspasoProgramadoDetailActions.UpdateTraspasoProgramado({ traspasoProgramado: updatedTraspasoData }));
    this.detailTraspasoForm.markAsPristine();
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
    this.router.navigate(['traspasos/traspasos-programados-list'])
  }

  get frecuenciaSeleccionadaNewForm(): string {
    return this.newTraspasoForm.get('Frecuencia')?.value;
  }

  get frecuenciaSeleccionadaDetailForm(): string {
    return this.detailTraspasoForm.get('Frecuencia')?.value;
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
      this.newTraspasoForm.get('Frecuencia')?.setValue(nuevaFrecuencia);
    } else {
      this.detailTraspasoForm.get('Frecuencia')?.setValue(nuevaFrecuencia);
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

  onCuentaOrigenChange(event: any): void {
    const cuentaOrigen = event.value;
    if (cuentaOrigen) {
      this.filterCuentasDestinos(cuentaOrigen);
    } else {
      this.filteredCuentasDestinos = this.cuentas;
    }
  }

  onCuentaDestinoChange(event: any): void {
    const cuentaDestino = event.value;

    if (cuentaDestino) {
      this.filterCuentasOrigen(cuentaDestino);
    } else {
      this.filteredCuentasOrigen = this.cuentas;
    }

  }

  private filterCuentasDestinos(cuentaOrigen: Cuenta): void {
    if (this.cuentas) {
      this.filteredCuentasDestinos = this.cuentas
        .filter(cuenta => cuenta.Id !== cuentaOrigen.Id)
        .sort((a, b) => a.Nombre.localeCompare(b.Nombre)); // Ordena alfabéticamente por 'Nombre'
    }
  }

  private filterCuentasOrigen(cuentaDestino: Cuenta): void {
    if (this.cuentas) {
      this.filteredCuentasOrigen = this.cuentas
        .filter(cuenta => cuenta.Id !== cuentaDestino.Id)
        .sort((a, b) => a.Nombre.localeCompare(b.Nombre)); // Ordena alfabéticamente por 'Nombre'
    }
  }

  private filterInitialCuentas(): void {
    const cuentaOrigen = this.detailTraspasoForm.get('CuentaOrigen')?.value;
    const cuentaDestino = this.detailTraspasoForm.get('CuentaDestino')?.value;

    if (cuentaOrigen) {
      this.filterCuentasDestinos(cuentaOrigen);
    }

    if (cuentaDestino) {
      this.filterCuentasOrigen(cuentaDestino);
    }
  }

  removeBlur() {
    document.body.classList.remove('blur-background');
  }
}
