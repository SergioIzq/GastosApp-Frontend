import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, takeUntil, of, filter, switchMap, map, combineLatest } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Ingreso } from 'src/app/shared/models/entidades/ingreso.model';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as IngresoDetailActions from '../../ngrx/actions/ingreso-detail.actions'
import * as IngresoSelector from '../../ngrx/selectors/ingreso-detail.selectors'
import { Router } from '@angular/router';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { Persona } from 'src/app/shared/models/entidades/persona.model';
import { Cliente } from 'src/app/shared/models/entidades/cliente.model';
import { FormaPago } from 'src/app/shared/models/entidades/formaPago.model';
import { Categoria } from 'src/app/shared/models/entidades/categoria.model';
import { Concepto } from 'src/app/shared/models/entidades/concepto.model';
import { minAmountValidator } from 'src/app/shared/models/entidades/minAmountValidator.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IngresoRespuesta } from 'src/app/shared/models/entidades/respuestas/ingresos/ingresoRespuesta.model';
import { ChangeDetectorRef } from '@angular/core';
import { IngresoByIdRespuesta } from 'src/app/shared/models/entidades/respuestas/ingresos/ingresoByIdRespuesta.model';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import { IngresoDetailState } from 'src/app/shared/models/entidades/estados/ingresoDetailState.model';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';

@Component({
  selector: 'app-ingreso-detail',
  templateUrl: './ingreso-detail.component.html',
  styleUrls: ['./ingreso-detail.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class IngresoDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  ingresoId: number = 0;
  ingresoPorId$!: Observable<IngresoByIdRespuesta | null>;
  loading: boolean = false;
  error$!: Observable<boolean>;
  detailIngresoForm: FormGroup;
  originalIngresoData!: Ingreso;
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
  idUsuario: any | null = null;
  deshabilitarBoton: boolean = false;
  private _confirmationService: ConfirmationService = inject(ConfirmationService);
  ingresoRespuesta: IngresoRespuesta = new IngresoRespuesta();
  private cdRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  constructor(
    private store: Store<IngresoDetailState>,
    private _store: Store<AuthState>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private actionsSubject: ActionsSubject
  ) {

    this.newIngresoForm = this.fb.group({
      IdUsuario: [''],
      Monto: ['', [Validators.required, Validators.pattern(/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/), minAmountValidator]],
      Fecha: ['', [Validators.required]],
      Descripcion: ['', [Validators.maxLength(200)]],
      Concepto: ['', [Validators.required]],
      Cliente: ['', [Validators.required]],
      Persona: ['', [Validators.required]],
      FormaPago: ['', [Validators.required]],
      Cuenta: ['', [Validators.required]],
      Categoria: ['', [Validators.required]]
    });

    this.detailIngresoForm = this.fb.group({
      Id: [''],
      IdUsuario: [''],
      Monto: ['', [Validators.required, Validators.pattern(/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/), minAmountValidator]],
      Fecha: ['', [Validators.required]],
      Descripcion: ['', [Validators.maxLength(200)]],
      Concepto: ['', [Validators.required]],
      Categoria: ['', [Validators.required]],
      Cliente: ['', [Validators.required]],
      Persona: ['', [Validators.required]],
      FormaPago: ['', [Validators.required]],
      Cuenta: ['', [Validators.required]],
    });

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

          this.store.dispatch(IngresoDetailActions.GetNewIngreso({ payload: idUsuario }));
        } else {
          this.isNewIngreso = false;
          this.store.dispatch(IngresoDetailActions.GetIngreso({ id }));
          this.ingresoPorId$ = this.store.select(IngresoSelector.selectedIngresoSelector);
        }
      });


    this.actionsSubject.pipe(filter(action => action.type === 'CreateIngresoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        if (this.idUsuario) {
          this.router.navigate(['ingresos/ingreso-detail', action.ingreso.Item.Id])
          this.ingresoId = action.ingreso.Item.Id;
          this.isNewIngreso = false;
          this.detailIngresoForm.patchValue(this.newIngresoForm.value);
          this.detailIngresoForm.markAsPristine();
        }
      });

    this.actionsSubject.pipe(filter(action => action.type === 'GetNewIngresoSuccess'), takeUntil(this.destroy$))
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
      .subscribe((ingresoByIdRespuesta: IngresoByIdRespuesta | null) => {
        if (ingresoByIdRespuesta) {
          let ingreso = ingresoByIdRespuesta.IngresoById;
          this.cuentas = [...ingresoByIdRespuesta.IngresoRespuesta.ListaCuentas];
          this.formasPago = [...ingresoByIdRespuesta.IngresoRespuesta.ListaFormasPago];
          this.personas = [...ingresoByIdRespuesta.IngresoRespuesta.ListaPersonas];
          this.clientes = [...ingresoByIdRespuesta.IngresoRespuesta.ListaClientes];
          this.conceptos = [...ingresoByIdRespuesta.IngresoRespuesta.ListaConceptos];
          this.categorias = [...ingresoByIdRespuesta.IngresoRespuesta.ListaCategorias];
          this.cdRef.detectChanges();

          // Convierte la fecha de UTC a local
          const fechaUTC = new Date(ingreso.Fecha);
          const fechaLocal = new Date(fechaUTC.getTime() - fechaUTC.getTimezoneOffset() * 60000);
          const monto = this.replaceDotsWithCommas(ingreso.Monto);
          this.selectedCategoria = ingreso.Concepto.Categoria.Id;
          this.selectedConceptoId = ingreso.Concepto.Id;

          this.detailIngresoForm.patchValue({
            ...ingreso,
            Fecha: fechaLocal,
            Monto: monto,
            Categoria: ingreso.Concepto.Categoria,
          });

          this.originalIngresoData = { ...ingreso }

          this.filteredConceptos.push(ingreso.Concepto);
          this.detailIngresoForm.markAsPristine();
        }
      });

    this.store.select(IngresoSelector.selectLoading).pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.loading = loading;
    });

    this.error$ = this.store.select(IngresoSelector.selectErrorCarga);
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

    if (this.isNewIngreso) {
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
          this.createIngreso(formValue, fechaUTC);
        } else {
          this.updateIngreso(formValue, fechaUTC);
        }
      }
    });
  }

  private createIngreso(formattedFormValue: any, fechaUTC: any) {
    const newIngresoData = { ...formattedFormValue, Fecha: fechaUTC };
    this.store.dispatch(IngresoDetailActions.CreateIngreso({ payload: newIngresoData }));
    this.deshabilitarBoton = true;
  }

  private updateIngreso(formattedFormValue: any, fechaUTC: any) {
    const updatedIngresoData = { ...formattedFormValue, Fecha: fechaUTC };
    updatedIngresoData.Id = this.ingresoId;
    this.store.dispatch(IngresoDetailActions.UpdateIngreso({ ingreso: updatedIngresoData }));
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
    this.router.navigate(['ingresos/ingresos-list'])
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

  removeBlur() {
    document.body.classList.remove('blur-background');
  }

}