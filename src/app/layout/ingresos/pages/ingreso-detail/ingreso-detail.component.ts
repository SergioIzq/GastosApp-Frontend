import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, takeUntil, of, switchMap, filter, pipe, combineLatest } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Ingreso } from 'src/app/shared/models/entidades/ingreso.model';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute } from '@angular/router';
import * as IngresoDetailActions from '../../ngrx/actions/ingreso-detail.actions'
import * as IngresoSelector from '../../ngrx/selectors/ingreso-detail.selectors'
import { Router } from '@angular/router';
import { ResponseOne } from 'src/app/shared/models/entidades/responseOne.model';
import { ResponseData } from 'src/app/shared/models/entidades/responseData.model';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { Persona } from 'src/app/shared/models/entidades/persona.model';
import { Cliente } from 'src/app/shared/models/entidades/cliente.model';
import { FormaPago } from 'src/app/shared/models/entidades/formaPago.model';
import { Categoria } from 'src/app/shared/models/entidades/categoria.model';
import { Concepto } from 'src/app/shared/models/entidades/concepto.model';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import { selectUsuarioPorId } from 'src/app/shared/menu/ngrx/selectors/menu.selectors';

@Component({
  selector: 'app-ingreso-detail',
  templateUrl: './ingreso-detail.component.html',
  styleUrls: ['./ingreso-detail.component.css']
})
export class IngresoDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  ingresoId: number = 0;
  ingresoPorId$!: Observable<Ingreso | null>;
  loading: boolean = false;
  error$!: Observable<boolean>;
  detailIngresoForm: FormGroup;
  originalIngresoData!: Ingreso;
  isNewIngreso: boolean = false;
  newIngresoForm!: FormGroup;
  cuentas$!: Observable<ResponseData<Cuenta> | null>;
  cuentas!: ResponseData<Cuenta>;
  personas$!: Observable<ResponseData<Persona> | null>;
  personas!: ResponseData<Persona>;
  clientes$!: Observable<ResponseData<Cliente> | null>;
  clientes!: ResponseData<Cliente>;
  formasPago$!: Observable<ResponseData<FormaPago> | null>;
  formasPago!: ResponseData<FormaPago>;
  conceptos$!: Observable<ResponseData<Concepto> | null>;
  conceptos!: ResponseData<Concepto>;
  categorias: Categoria[] = [];
  filteredConceptos: Concepto[] = [];
  categoriaSeleccionada: Categoria | null = null;
  selectedCategoria: any | null = null;
  selectedConceptoId!: number;
  idUsuario: any | null = null;
  deshabilitarBoton: boolean = false;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private actionsSubject: ActionsSubject
  ) {

    this.newIngresoForm = this.fb.group({
      IdUsuario: [''],
      Monto: ['', [Validators.required, Validators.pattern(/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/), Validators.min(0.01)]],
      Fecha: ['', [Validators.required]],
      Descripcion: ['', [Validators.maxLength(200)]],
      Concepto: ['', [Validators.required]],
      Cliente: ['', [Validators.required]],
      Persona: ['', [Validators.required]],
      FormaPago: ['', [Validators.required]],
      Cuenta: ['', [Validators.required]],
    });

    this.detailIngresoForm = this.fb.group({
      Id: [''],
      IdUsuario: [''],
      Monto: ['', [Validators.required, Validators.pattern(/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/), Validators.min(0.01)]],
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

    this.store.select(selectUsuarioPorId).pipe(takeUntil(this.destroy$)).subscribe((idUsuario: any) => {
      this.idUsuario = idUsuario?.Id;
      if (this.idUsuario) {
        this.store.dispatch(IngresoDetailActions.GetPersonasIngreso({ idUsuario: this.idUsuario }));
        this.store.dispatch(IngresoDetailActions.GetClientesIngreso({ idUsuario: this.idUsuario }));
        this.store.dispatch(IngresoDetailActions.GetFormasPagoIngreso({ idUsuario: this.idUsuario }));
        this.store.dispatch(IngresoDetailActions.GetConceptosIngreso({ idUsuario: this.idUsuario }));
        this.store.dispatch(IngresoDetailActions.GetCuentasIngreso({ idUsuario: this.idUsuario }));
      }
    });

    this.actionsSubject.pipe(filter(action => action.type === 'CreateIngresoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        if (this.idUsuario) {
          this.router.navigate(['ingresos/ingreso-detail', action.ingreso.Item.Id])
          this.store.dispatch(IngresoDetailActions.GetCuentasIngreso({ idUsuario: this.idUsuario }));
          this.isNewIngreso = false;
          this.detailIngresoForm.markAsPristine();
        }
      });

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const idString = params.get('id');
      if (idString !== null) {
        const id = parseInt(idString, 10);
        this.ingresoId = id;
        if (id === 0) {
          // Si el ID es 0, significa que es una nueva visita
          this.isNewIngreso = true;
          this.ingresoPorId$ = of(null);
          this.newIngresoForm.patchValue({
            Fecha: new Date().toLocaleDateString('es-ES')
          })
        } else {
          // Si el ID no es 0, obtener el ingreso por el ID
          this.isNewIngreso = false;
          this.store.dispatch(IngresoDetailActions.GetIngreso({ id: id }));
          this.ingresoPorId$ = this.store.select(IngresoSelector.selectedIngresoSelector);
        }
      }
    });

    this.cuentas$ = this.store.select(IngresoSelector.selectCuentas);
    this.cuentas$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cuentas: ResponseData<Cuenta> | null) => {
        if (cuentas) {
          this.cuentas = cuentas;
        }
      });

    this.formasPago$ = this.store.select(IngresoSelector.selectFormasPago);
    this.formasPago$
      .pipe(takeUntil(this.destroy$))
      .subscribe((formasPago: ResponseData<FormaPago> | null) => {
        if (formasPago) {
          this.formasPago = formasPago;
        }
      });

    this.personas$ = this.store.select(IngresoSelector.selectPersonas);
    this.personas$
      .pipe(takeUntil(this.destroy$))
      .subscribe((personas: ResponseData<Persona> | null) => {
        if (personas) {
          this.personas = personas;
        }
      });

    this.clientes$ = this.store.select(IngresoSelector.selectClientes);
    this.clientes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((clientes: ResponseData<Cliente> | null) => {
        if (clientes) {
          this.clientes = clientes;
        }
      });

    this.conceptos$ = this.store.select(IngresoSelector.selectConceptos);
    this.conceptos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((conceptos: any) => {
        if (conceptos) {
          this.conceptos = conceptos;
          if (!this.selectedCategoria) {
            this.extractCategorias(conceptos.Items);
          }
        }
      });

    this.ingresoPorId$ = this.store.select(IngresoSelector.selectedIngresoSelector);

    this.ingresoPorId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((ingreso: Ingreso | null) => {
        if (ingreso) {
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
            Concepto: ingreso.Concepto,
          });
          this.originalIngresoData = { ...ingreso };
          this.categorias.push(ingreso.Concepto.Categoria);

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
      const newIngresoData = { ...formattedFormValue, Fecha: fechaUTC };
      this.store.dispatch(IngresoDetailActions.CreateIngreso({ payload: newIngresoData }));
      this.deshabilitarBoton = true;
    } else {
      const updatedIngresoData = { ...formattedFormValue, Fecha: fechaUTC };
      updatedIngresoData.Id = this.originalIngresoData.Id;
      this.store.dispatch(IngresoDetailActions.UpdateIngreso({ ingreso: updatedIngresoData }));
      this.detailIngresoForm.markAsPristine();
      this.deshabilitarBoton = true;
    }
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

  private extractCategorias(conceptos: Concepto[]): void {

    const categoriasSet = new Set<number>(); // Usamos Set para mantener ids únicos
    const categoriasMap = new Map<number, Categoria>(); // Map para mantener un mapa de id a objeto Categoria

    conceptos.forEach(concepto => {
      if (concepto.Categoria) {
        if (!categoriasSet.has(concepto.Categoria.Id)) {
          categoriasSet.add(concepto.Categoria.Id);
          categoriasMap.set(concepto.Categoria.Id, concepto.Categoria);
        }
      }
    });

    this.categorias = Array.from(categoriasMap.values());
  }

  onCategoriaChange(event: any): void {
    this.extractCategorias(this.conceptos.Items)
    this.selectedCategoria = event.value ? event.value.Id : null;
    this.detailIngresoForm.patchValue({ Concepto: null })
    this.filterConceptos();
  }

  private filterConceptos(): void {

    if (this.selectedCategoria !== null && this.conceptos) {
      this.selectedCategoria;

      // Verifica el tipo de categoriaId y los Ids en conceptos.Categoria

      // Filtra los conceptos por la categoría seleccionada
      this.filteredConceptos = this.conceptos.Items.filter(concepto => {
        const conceptoCategoriaId = concepto.Categoria.Id;
        return conceptoCategoriaId === this.selectedCategoria;
      });

    } else {
      // Si no hay categoría seleccionada, mostrar todos los conceptos
      this.filteredConceptos = this.conceptos ? this.conceptos.Items : [];
    }

  }



}
