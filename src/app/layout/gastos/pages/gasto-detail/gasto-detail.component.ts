import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, takeUntil, of, filter, map, switchMap, combineLatest } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Gasto } from 'src/app/shared/models/entidades/gasto.model';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as GastoDetailActions from '../../ngrx/actions/gasto-detail.actions'
import * as GastoSelector from '../../ngrx/selectors/gasto-detail.selectors'
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
import { GastoByIdRespuesta } from 'src/app/shared/models/entidades/respuestas/gastos/gastoByIdRespuesta.model';
import { GastoDetailState } from 'src/app/shared/models/entidades/estados/gastoDetailState.model';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';

@Component({
  selector: 'app-gasto-detail',
  templateUrl: './gasto-detail.component.html',
  styleUrls: ['./gasto-detail.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class GastoDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  gastoId: number = 0;
  gastoPorId$!: Observable<GastoByIdRespuesta | null>;
  loading: boolean = false;
  error$!: Observable<boolean>;
  detailGastoForm: FormGroup;
  originalGastoData!: Gasto;
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
  private _confirmationService: ConfirmationService = inject(ConfirmationService);
  private cdRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  constructor(
    private store: Store<GastoDetailState>,
    private _store: Store<AuthState>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private actionsSubject: ActionsSubject
  ) {

    this.newGastoForm = this.fb.group({
      IdUsuario: [''],
      Monto: ['', [Validators.required, Validators.pattern(/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/), minAmountValidator]],
      Fecha: ['', [Validators.required]],
      Descripcion: ['', [Validators.maxLength(200)]],
      Concepto: ['', [Validators.required]],
      Proveedor: ['', [Validators.required]],
      Persona: ['', [Validators.required]],
      FormaPago: ['', [Validators.required]],
      Cuenta: ['', [Validators.required]],
      Categoria: ['', [Validators.required]]
    });

    this.detailGastoForm = this.fb.group({
      Id: [''],
      IdUsuario: [''],
      Monto: ['', [Validators.required, Validators.pattern(/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/), minAmountValidator]],
      Fecha: ['', [Validators.required]],
      Descripcion: ['', [Validators.maxLength(200)]],
      Concepto: ['', [Validators.required]],
      Categoria: ['', [Validators.required]],
      Proveedor: ['', [Validators.required]],
      Persona: ['', [Validators.required]],
      FormaPago: ['', [Validators.required]],
      Cuenta: ['', [Validators.required]],
    });

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
          this.newGastoForm.patchValue({
            Fecha: new Date().toLocaleDateString('es-ES')
          });

          this.store.dispatch(GastoDetailActions.GetNewGasto({ payload: idUsuario }));
        } else {
          this.isNewGasto = false;
          this.store.dispatch(GastoDetailActions.GetGasto({ id }));
          this.gastoPorId$ = this.store.select(GastoSelector.selectedGastoSelector);
        }
      });

    this.actionsSubject.pipe(filter(action => action.type === 'CreateGastoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        if (this.idUsuario) {
          this.router.navigate(['gastos/gasto-detail', action.gasto.Item.Id])
          this.gastoId = action.gasto.Item.Id;
          this.isNewGasto = false;
          this.detailGastoForm.patchValue(this.newGastoForm.value);
          this.detailGastoForm.markAsPristine();
        }
      });

    this.actionsSubject.pipe(filter(action => action.type === 'GetNewGastoSuccess'), takeUntil(this.destroy$))
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
      .subscribe((gastoByIdRespuesta: GastoByIdRespuesta | null) => {
        if (gastoByIdRespuesta) {
          let gasto = gastoByIdRespuesta.GastoById;
          this.cuentas = [...gastoByIdRespuesta.GastoRespuesta.ListaCuentas];
          this.formasPago = [...gastoByIdRespuesta.GastoRespuesta.ListaFormasPago];
          this.personas = [...gastoByIdRespuesta.GastoRespuesta.ListaPersonas];
          this.proveedores = [...gastoByIdRespuesta.GastoRespuesta.ListaProveedores];
          this.conceptos = [...gastoByIdRespuesta.GastoRespuesta.ListaConceptos];
          this.categorias = [...gastoByIdRespuesta.GastoRespuesta.ListaCategorias];
          this.cdRef.detectChanges();

          // Convierte la fecha de UTC a local
          const fechaUTC = new Date(gasto.Fecha);
          const fechaLocal = new Date(fechaUTC.getTime() - fechaUTC.getTimezoneOffset() * 60000);
          const monto = this.replaceDotsWithCommas(gasto.Monto);
          this.selectedCategoria = gasto.Concepto.Categoria.Id;
          this.selectedConceptoId = gasto.Concepto.Id;

          this.detailGastoForm.patchValue({
            ...gasto,
            Fecha: fechaLocal,
            Monto: monto,
            Categoria: gasto.Concepto.Categoria,
          });

          this.originalGastoData = { ...gasto }

          this.filteredConceptos.push(gasto.Concepto);
          this.detailGastoForm.markAsPristine();
        }
      });

    this.store.select(GastoSelector.selectLoading).pipe(takeUntil(this.destroy$)).subscribe((loading: boolean) => {
      this.loading = loading;
    });

    this.error$ = this.store.select(GastoSelector.selectErrorCarga);

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

    let fechaLocal = formValue.Fecha;


    if (typeof fechaLocal === 'string' && fechaLocal.includes('/')) {
      const [day, month, year] = fechaLocal.split('/').map(Number);
      fechaLocal = new Date(year, month - 1, day);
    }

    const fechaUTC = new Date(fechaLocal.getTime() - fechaLocal.getTimezoneOffset() * 60000).toISOString();

    const formattedImporte = this.replaceCommasWithDots(formValue.Monto);

    // Crea un nuevo objeto con el Monto formateado
    const formattedFormValue = {
      ...formValue,
      Monto: formattedImporte
    };

    if (this.isNewGasto) {
      this.showConfirmation('create', formattedFormValue, fechaUTC);
    } else {
      this.showConfirmation('edit', formattedFormValue, fechaUTC);
    }
  }

  private showConfirmation(actionType: string, formValue: any, fechaUTC: any) {
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
          this.createGasto(formValue, fechaUTC);
        } else {
          this.updateGasto(formValue, fechaUTC);
        }
      }
    });
  }

  private createGasto(formattedFormValue: any, fechaUTC: any) {
    const newGastoData = { ...formattedFormValue, Fecha: fechaUTC };
    this.store.dispatch(GastoDetailActions.CreateGasto({ payload: newGastoData }));
    this.deshabilitarBoton = true;
  }

  private updateGasto(formattedFormValue: any, fechaUTC: any) {
    const updatedGastoData = { ...formattedFormValue, Fecha: fechaUTC };
    updatedGastoData.Id = this.gastoId;
    this.store.dispatch(GastoDetailActions.UpdateGasto({ gasto: updatedGastoData }));
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
    this.router.navigate(['gastos/gastos-list'])
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

  removeBlur() {
    document.body.classList.remove('blur-background');
  }
}
