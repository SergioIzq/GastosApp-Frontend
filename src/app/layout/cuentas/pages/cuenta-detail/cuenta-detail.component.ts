import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CuentaDetailState } from 'src/app/shared/models/entidades/estados/cuentaDetailState.model';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';

@Component({
  selector: 'app-cuenta-detail',
  templateUrl: './cuenta-detail.component.html',
  styleUrls: ['./cuenta-detail.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class CuentaDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  cuentaId: number = 0;
  cuentaPorId$!: Observable<Cuenta | null>;
  loading: boolean = false;
  error$!: Observable<boolean>;
  detailCuentaForm: FormGroup;
  originalCuentaData!: Cuenta;
  isNewCuenta: boolean = false;
  newCuentaForm!: FormGroup;
  selectedOption!: string;
  idUsuario!: number;
  deshabilitarBoton: boolean = false;
  private _confirmationService: ConfirmationService = inject(ConfirmationService);

  constructor(
    private store: Store<CuentaDetailState>,
    private _store: Store<AuthState>,
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

    this._store.select(selectUserId).pipe(takeUntil(this.destroy$)).subscribe((idUsuario: number) => {
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

    this.store.select(CuentaSelector.selectLoading).pipe(takeUntil(this.destroy$)).subscribe((loading: boolean) => {
      this.loading = loading;
    });

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
    const formValue = this.isNewCuenta ? this.newCuentaForm.value : this.detailCuentaForm.value;
    formValue.IdUsuario = this.idUsuario;

    if (this.isNewCuenta) {
      this.showConfirmation('create', formValue);
    } else {
      this.showConfirmation('edit', formValue);
    }
  }

  // Método privado para mostrar el modal de confirmación
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
          this.createCuenta(formValue);
        } else {
          this.updateCuenta(formValue);
        }
      }
    });
  }

  private createCuenta(formValue: any) {
    const newCuentaData = { ...formValue };
    this.store.dispatch(CuentaDetailActions.CreateCuenta({ payload: newCuentaData }));
    this.deshabilitarBoton = true;
  }

  private updateCuenta(formValue: any) {
    const updatedCuentaData = { ...formValue };
    updatedCuentaData.Id = this.originalCuentaData.Id;
    this.store.dispatch(CuentaDetailActions.UpdateCuenta({ cuenta: updatedCuentaData }));
    this.detailCuentaForm.markAsPristine();
    this.deshabilitarBoton = true;
  }

  goBack(): void {
    this.router.navigate(['cuentas/cuentas-list']);
  }

}
