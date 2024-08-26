import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, takeUntil, of, switchMap } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import * as CuentaDetailActions from '../../ngrx/actions/cuenta-detail.actions';
import * as CuentaSelector from '../../ngrx/selectors/cuenta-detail.selectors';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { NumberFormatterPipe } from 'src/app/shared/pipes/numberFormatterPipe.pipe';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';

@Component({
  selector: 'app-cuenta-detail',
  templateUrl: './cuenta-detail.component.html',
  styleUrls: ['./cuenta-detail.component.css']
})
export class CuentaDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  cuentaId: number = 0;
  cuentaPorId$!: Observable<Cuenta | null>;
  cargando$!: Observable<boolean>;
  error$!: Observable<boolean>;
  detailCuentaForm: FormGroup;
  originalCuentaData!: Cuenta;
  isNewCuenta: boolean = false;
  newCuentaForm!: FormGroup;
  selectedOption!: string;
  idUsuario!: number;
  deshabilitarBoton: boolean = false;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private actionsSubject: ActionsSubject,
  ) {
    this.newCuentaForm = this.fb.group({
      IdUsuario: [''],
      Nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });


    this.detailCuentaForm = this.fb.group({
      Id: [''],
      IdUsuario: [''],
      Nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });

  }

  ngOnInit(): void {

    this.store.select(selectUserId).pipe(takeUntil(this.destroy$)).subscribe((idUsuario: number) => {
      this.idUsuario = idUsuario;
    })

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const idString = params.get('id');
      if (idString !== null) {
        const id = parseInt(idString, 10);
        this.cuentaId = id;
        if (id === 0) {
          this.isNewCuenta = true;
          this.cuentaPorId$ = of(null);
        } else {
          this.store.dispatch(CuentaDetailActions.GetCuenta({ id: id }));
          this.cuentaPorId$ = this.store.select(CuentaSelector.selectedCuentaSelector);
        }
      } else {
        console.error('No hay id por parámetro');
      }
    });
    this.cuentaPorId$ = this.store.select(CuentaSelector.selectedCuentaSelector);

    this.cuentaPorId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cuenta: Cuenta | null) => {
        if (cuenta) {
          this.detailCuentaForm.patchValue({
            ...cuenta,
          });
          this.originalCuentaData = { ...cuenta };
        }
      });

    this.cargando$ = this.store.select(CuentaSelector.selectCargando);
    this.error$ = this.store.select(CuentaSelector.selectErrorCarga);

    this.actionsSubject.pipe(filter(action => action.type === 'CreateCuentaSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.router.navigate(['cuentas/cuenta-detail', action.cuenta.Item.Id])
        this.isNewCuenta = false;
        this.detailCuentaForm.patchValue(action.Item);
      });
    this.detailCuentaForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });

    this.newCuentaForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit() {
    // Obtén el valor del formulario basado en si es una nueva cuenta o una cuenta existente
    const formValue = this.isNewCuenta ? this.newCuentaForm.value : this.detailCuentaForm.value;
    formValue.IdUsuario = this.idUsuario;

    // Crea un nuevo objeto con el Saldo formateado
    const formattedFormValue = {
      ...formValue,
    };

    if (this.isNewCuenta) {
      const newCuentaData = { ...formattedFormValue };
      this.store.dispatch(CuentaDetailActions.CreateCuenta({ payload: newCuentaData }));
      this.deshabilitarBoton = true;
    } else {
      const updatedCuentaData = { ...formattedFormValue, Id: this.originalCuentaData.Id };
      this.store.dispatch(CuentaDetailActions.UpdateCuenta({ cuenta: updatedCuentaData }));
      this.detailCuentaForm.markAsPristine();
      this.deshabilitarBoton = true;
    }
  }

  goBack(): void {
    this.router.navigate(['cuentas/cuentas-list']);
  }

  private replaceCommasWithDots(value: any): any {
    if (typeof value === 'string') {
      value = value.replace(/,/g, '.');
      return value.replace(/\.(?=.*\.)/g, '');
    }
    return value;
  }

}
