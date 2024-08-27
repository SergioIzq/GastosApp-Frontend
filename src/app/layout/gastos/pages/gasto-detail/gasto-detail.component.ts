import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, takeUntil, of, switchMap, filter, pipe } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Gasto } from 'src/app/shared/models/entidades/gasto.model';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute } from '@angular/router';
import * as GastoDetailActions from '../../ngrx/actions/gasto-detail.actions'
import * as GastoSelector from '../../ngrx/selectors/gasto-detail.selectors'
import { Router } from '@angular/router';
import { ResponseData } from 'src/app/shared/models/entidades/responseData.model';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { Persona } from 'src/app/shared/models/entidades/persona.model';
import { Proveedor } from 'src/app/shared/models/entidades/proveedor.model';
import { FormaPago } from 'src/app/shared/models/entidades/formaPago.model';
import { Categoria } from 'src/app/shared/models/entidades/categoria.model';
import { Concepto } from 'src/app/shared/models/entidades/concepto.model';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';

@Component({
  selector: 'app-gasto-detail',
  templateUrl: './gasto-detail.component.html',
  styleUrls: ['./gasto-detail.component.css']
})
export class GastoDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  gastoId: number = 0;
  gastoPorId$!: Observable<Gasto | null>;
  cargando$!: Observable<boolean>;
  error$!: Observable<boolean>;
  detailGastoForm: FormGroup;
  originalGastoData!: Gasto;
  isNewGasto: boolean = false;
  newGastoForm!: FormGroup;
  cuentas$!: Observable<ResponseData<Cuenta> | null>;
  cuentas!: ResponseData<Cuenta>;
  personas$!: Observable<ResponseData<Persona> | null>;
  personas!: ResponseData<Persona>;
  proveedores$!: Observable<ResponseData<Proveedor> | null>;
  proveedores!: ResponseData<Proveedor>;
  formasPago$!: Observable<ResponseData<FormaPago> | null>;
  formasPago!: ResponseData<FormaPago>;
  conceptos$!: Observable<ResponseData<Concepto> | null>;
  conceptos!: ResponseData<Concepto>;
  categorias: Categoria[] = [];
  filteredConceptos: Concepto[] = [];
  categoriaSeleccionada: Categoria | null = null;
  selectedCategoria: any | null = null;
  selectedConceptoId!: number;
  idUsuario: number | null = null;
  deshabilitarBoton: boolean = false;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private actionsSubject: ActionsSubject
  ) {

    this.newGastoForm = this.fb.group({
      IdUsuario: [''],
      Monto: ['', [Validators.required, Validators.pattern(/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/), Validators.min(0.01)]],
      Fecha: ['', [Validators.required]],
      Descripcion: ['', [Validators.maxLength(200)]],
      Concepto: ['', [Validators.required]],
      Proveedor: ['', [Validators.required]],
      Persona: ['', [Validators.required]],
      FormaPago: ['', [Validators.required]],
      Cuenta: ['', [Validators.required]],
    });

    this.detailGastoForm = this.fb.group({
      Id: [''],
      IdUsuario: [''],
      Monto: ['', [Validators.required, Validators.pattern(/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/), Validators.min(0.01)]],
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

    this.store.select(selectUserId).pipe(takeUntil(this.destroy$)).subscribe((idUsuario: number) => {
      if (idUsuario) {
        this.idUsuario = idUsuario;

        this.store.dispatch(GastoDetailActions.GetCuentasGasto({ idUsuario: this.idUsuario }));
        this.store.dispatch(GastoDetailActions.GetPersonasGasto({ idUsuario: this.idUsuario }));
        this.store.dispatch(GastoDetailActions.GetProveedoresGasto({ idUsuario: this.idUsuario }));
        this.store.dispatch(GastoDetailActions.GetFormasPagoGasto({ idUsuario: this.idUsuario }));
        this.store.dispatch(GastoDetailActions.GetConceptosGasto({ idUsuario: this.idUsuario }));
      }
    });


    this.actionsSubject.pipe(filter(action => action.type === 'CreateGastoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        if (this.idUsuario) {
          this.router.navigate(['gastos/gasto-detail', action.gasto.Item.Id])
          this.store.dispatch(GastoDetailActions.GetCuentasGasto({ idUsuario: this.idUsuario }));
          this.isNewGasto = false;
          this.detailGastoForm.markAsPristine();
        }
      });

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const idString = params.get('id');
      if (idString !== null) {
        const id = parseInt(idString, 10);
        this.gastoId = id;
        if (id === 0) {
          // Si el ID es 0, significa que es una nueva visita
          this.isNewGasto = true;
          this.gastoPorId$ = of(null);
          this.newGastoForm.patchValue({
            Fecha: new Date().toLocaleDateString('es-ES')
          })
        } else {
          // Si el ID no es 0, obtener el gasto por el ID
          this.isNewGasto = false;
          this.store.dispatch(GastoDetailActions.GetGasto({ id: id }));
          this.gastoPorId$ = this.store.select(GastoSelector.selectedGastoSelector);
        }
      } else {
        console.error('No hay id por parámetro');
      }
    });

    this.cuentas$ = this.store.select(GastoSelector.selectCuentas);
    this.cuentas$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cuentas: ResponseData<Cuenta> | null) => {
        if (cuentas) {
          this.cuentas = cuentas;

        }
      });

    this.formasPago$ = this.store.select(GastoSelector.selectFormasPago);
    this.formasPago$
      .pipe(takeUntil(this.destroy$))
      .subscribe((formasPago: ResponseData<FormaPago> | null) => {
        if (formasPago) {
          this.formasPago = formasPago;
        }
      });

    this.personas$ = this.store.select(GastoSelector.selectPersonas);
    this.personas$
      .pipe(takeUntil(this.destroy$))
      .subscribe((personas: ResponseData<Persona> | null) => {
        if (personas) {
          this.personas = personas;
        }
      });

    this.proveedores$ = this.store.select(GastoSelector.selectProveedores);
    this.proveedores$
      .pipe(takeUntil(this.destroy$))
      .subscribe((proveedores: ResponseData<Proveedor> | null) => {
        if (proveedores) {
          this.proveedores = proveedores;
        }
      });

    this.store.select(GastoSelector.selectConceptos).pipe(takeUntil(this.destroy$))
      .subscribe((conceptos: any) => {
        if (conceptos) {
          this.conceptos = conceptos;
          if (!this.selectedCategoria) {
            this.extractCategorias(conceptos.Items);
          }
        }
      });

    this.gastoPorId$ = this.store.select(GastoSelector.selectedGastoSelector);

    this.gastoPorId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((gasto: Gasto | null) => {
        if (gasto) {
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
            Categoria: gasto.Concepto.Categoria
          });

          this.originalGastoData = { ...gasto }
          this.categorias.push(gasto.Concepto.Categoria);

          this.filteredConceptos.push(gasto.Concepto);
          this.detailGastoForm.markAsPristine();

        }
      });

    this.cargando$ = this.store.select(GastoSelector.selectCargando);
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

    const fechaUTC = fechaLocal.toISOString();

    const formattedImporte = this.replaceCommasWithDots(formValue.Monto);

    // Crea un nuevo objeto con el Monto formateado
    const formattedFormValue = {
      ...formValue,
      Monto: formattedImporte
    };

    if (this.isNewGasto) {
      const newGastoData = { ...formattedFormValue, Fecha: fechaUTC };
      this.store.dispatch(GastoDetailActions.CreateGasto({ payload: newGastoData }));
      this.deshabilitarBoton = true;
    } else {
      const updatedGastoData = { ...formattedFormValue, Fecha: fechaUTC };
      updatedGastoData.Id = this.originalGastoData.Id;
      this.store.dispatch(GastoDetailActions.UpdateGasto({ gasto: updatedGastoData }));
      this.detailGastoForm.markAsPristine();
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
    this.router.navigate(['gastos/gastos-list'])
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
    this.detailGastoForm.patchValue({Concepto: null})
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
