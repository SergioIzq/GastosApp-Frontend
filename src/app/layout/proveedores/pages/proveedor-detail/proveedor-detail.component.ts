import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, takeUntil, of, switchMap } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Proveedor } from 'src/app/shared/models/entidades/proveedor.model';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import * as ProveedorDetailActions from '../../ngrx/actions/proveedor-detail.actions';
import * as ProveedorSelector from '../../ngrx/selectors/proveedor-detail.selectors';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProveedorDetailState } from 'src/app/shared/models/entidades/estados/proveedorDetailState.model';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';

@Component({
  selector: 'app-proveedor-detail',
  templateUrl: './proveedor-detail.component.html',
  styleUrls: ['./proveedor-detail.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ProveedorDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  proveedorId: number = 0;
  proveedorPorId$!: Observable<Proveedor | null>;
  loading: boolean = false;
  error$!: Observable<boolean>;
  detailProveedorForm: FormGroup;
  originalProveedorData!: Proveedor;
  isNewProveedor: boolean = false;
  newProveedorForm!: FormGroup;
  selectedOption!: string;
  idUsuario!: number;
  deshabilitarBoton: boolean = false;
  private _confirmationService: ConfirmationService = inject(ConfirmationService);

  constructor(
    private store: Store<ProveedorDetailState>,
    private _store: Store<AuthState>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private actionsSubject: ActionsSubject
  ) {
    this.newProveedorForm = this.fb.group({
      IdUsuario: [''],
      Nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });

    this.detailProveedorForm = this.fb.group({
      Id: [''],
      IdUsuario: [''],
      Nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });

  }

  ngOnInit(): void {

    this._store.select(selectUserId).pipe(takeUntil(this.destroy$)).subscribe((idUsuario: number) => {
      this.idUsuario = idUsuario;
    });

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const idString = params.get('id');
      if (idString !== null) {
        const id = parseInt(idString, 10);
        this.proveedorId = id;
        if (id === 0) {
          this.isNewProveedor = true;
          this.proveedorPorId$ = of(null);
        } else {
          this.store.dispatch(ProveedorDetailActions.GetProveedor({ id: id }));
          this.proveedorPorId$ = this.store.select(ProveedorSelector.selectedProveedorSelector);
        }
      }
    });
    this.proveedorPorId$ = this.store.select(ProveedorSelector.selectedProveedorSelector);

    this.proveedorPorId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((proveedor: Proveedor | null) => {
        if (proveedor) {
          this.detailProveedorForm.patchValue({
            ...proveedor,
          });
          this.originalProveedorData = { ...proveedor };
          this.loading = false;
        }
      });

    this.store.select(ProveedorSelector.selectLoading).pipe(takeUntil(this.destroy$)).subscribe((loading: boolean) => {
      this.loading = loading;
    });

    this.error$ = this.store.select(ProveedorSelector.selectErrorCarga);

    this.actionsSubject.pipe(filter(action => action.type === 'CreateProveedorSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.loading = true;
        this.router.navigate(['proveedores/proveedor-detail', action.proveedor.Item.Id])
        this.isNewProveedor = false;
        this.detailProveedorForm.patchValue(action.Item);

      });
    this.detailProveedorForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });

    this.newProveedorForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit() {
    const formValue = this.isNewProveedor ? this.newProveedorForm.value : this.detailProveedorForm.value;
    formValue.IdUsuario = this.idUsuario;

    if (this.isNewProveedor) {
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
          this.createProveedor(formValue);
        } else {
          this.updateProveedor(formValue);
        }
      }
    });
  }

  // Método privado para crear el proveedor
  private createProveedor(formValue: any) {
    const newProveedorData = { ...formValue };
    this.store.dispatch(ProveedorDetailActions.CreateProveedor({ payload: newProveedorData }));
    this.deshabilitarBoton = true;
  }

  // Método privado para actualizar el proveedor
  private updateProveedor(formValue: any) {
    const updatedProveedorData = { ...formValue };
    updatedProveedorData.Id = this.originalProveedorData.Id;
    this.store.dispatch(ProveedorDetailActions.UpdateProveedor({ proveedor: updatedProveedorData }));
    this.detailProveedorForm.markAsPristine();
    this.deshabilitarBoton = true;
  }

  goBack(): void {
    this.router.navigate(['proveedores/proveedores-list']);
  }

  removeBlur() {
    document.body.classList.remove('blur-background');
  }
}
