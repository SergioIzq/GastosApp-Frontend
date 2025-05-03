import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, takeUntil, of, switchMap } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormaPago } from 'src/app/shared/models/entidades/formaPago.model';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import * as FormaPagoDetailActions from '../../ngrx/actions/forma-pago-detail.actions';
import * as FormaPagoSelector from '../../ngrx/selectors/forma-pago-detail.selectors';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormaPagoDetailState } from 'src/app/shared/models/entidades/estados/formaPagoDetailState.model';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';

@Component({
  selector: 'app-forma-pago-detail',
  templateUrl: './forma-pago-detail.component.html',
  styleUrls: ['./forma-pago-detail.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class FormaPagoDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  formaId: number = 0;
  formaPorId$!: Observable<FormaPago | null>;
  loading: boolean = false;
  error$!: Observable<boolean>;
  detailFormaPagoForm: FormGroup;
  originalFormaPagoData!: FormaPago;
  isNewFormaPago: boolean = false;
  newFormaPagoForm!: FormGroup;
  selectedOption!: string;
  idUsuario!: number;
  deshabilitarBoton: boolean = false;
  private _confirmationService:ConfirmationService = inject(ConfirmationService);
  
  constructor(
    private store: Store<FormaPagoDetailState>,
    private _store: Store<AuthState>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private actionsSubject: ActionsSubject
  ) {
    this.newFormaPagoForm = this.fb.group({
      IdUsuario: [''],
      Nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });


    this.detailFormaPagoForm = this.fb.group({
      Id: [''],
      IdUsuario: [''],
      Nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });

  }

  ngOnInit(): void {

    this._store.select(selectUserId).pipe(takeUntil(this.destroy$)).subscribe((idUsuario: number) => {
      this.idUsuario = idUsuario
    });

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const idString = params.get('id');
      if (idString !== null) {
        const id = parseInt(idString, 10);
        this.formaId = id;
        if (id === 0) {
          this.isNewFormaPago = true;
          this.formaPorId$ = of(null);
        } else {
          this.store.dispatch(FormaPagoDetailActions.GetFormaPago({ id: id }));
          this.formaPorId$ = this.store.select(FormaPagoSelector.selectedFormaPagoSelector);
        }
      }
    });
    this.formaPorId$ = this.store.select(FormaPagoSelector.selectedFormaPagoSelector);

    this.formaPorId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((forma: FormaPago | null) => {
        if (forma) {
          this.detailFormaPagoForm.patchValue({
            ...forma,
          });
          this.originalFormaPagoData = { ...forma };
        }
      });

    this.store.select(FormaPagoSelector.selectLoading).pipe(takeUntil(this.destroy$)).subscribe((loading: boolean) => {
      this.loading = loading;
    });

    this.error$ = this.store.select(FormaPagoSelector.selectErrorCarga);

    this.actionsSubject.pipe(filter(action => action.type === 'CreateFormaPagoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.router.navigate(['formas-pago/forma-pago-detail', action.formaPago.Item.Id])
        this.isNewFormaPago = false;
        this.detailFormaPagoForm.patchValue(action.Item);
      });
    this.detailFormaPagoForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });

    this.newFormaPagoForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit() {
    const formValue = this.isNewFormaPago ? this.newFormaPagoForm.value : this.detailFormaPagoForm.value;
    formValue.IdUsuario = this.idUsuario;

    if (this.isNewFormaPago) {
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
          this.createFormaPago(formValue);
        } else {
          this.updateFormaPago(formValue);
        }
      }
    });
  }

  private createFormaPago(formValue: any) {
    const newFormaPagoData = { ...formValue };
    this.store.dispatch(FormaPagoDetailActions.CreateFormaPago({ payload: newFormaPagoData }));
    this.deshabilitarBoton = true;
  }

  private updateFormaPago(formValue: any) {
    const updatedFormaPagoData = { ...formValue };
    updatedFormaPagoData.Id = this.originalFormaPagoData.Id;
    this.store.dispatch(FormaPagoDetailActions.UpdateFormaPago({ formaPago: updatedFormaPagoData }));
    this.detailFormaPagoForm.markAsPristine();
    this.deshabilitarBoton = true;
  }

  goBack(): void {
    this.router.navigate(['formas-pago/formas-pago-list']);
  }

}
