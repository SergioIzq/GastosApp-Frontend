import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, takeUntil, of } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cliente } from 'src/app/shared/models/entidades/cliente.model';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClienteDetailActions from '../../ngrx/actions/cliente-detail.actions';
import * as ClienteSelector from '../../ngrx/selectors/cliente-detail.selectors';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-cliente-detail',
  templateUrl: './cliente-detail.component.html',
  styleUrls: ['./cliente-detail.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ClienteDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  clienteId: number = 0;
  clientePorId$!: Observable<Cliente | null>;
  loading: boolean = false;
  error$!: Observable<boolean>;
  detailClienteForm: FormGroup;
  originalClienteData!: Cliente;
  isNewCliente: boolean = false;
  newClienteForm!: FormGroup;
  selectedOption!: string;
  idUsuario!: number;
  deshabilitarBoton: boolean = false;
  private _confirmationService: ConfirmationService = inject(ConfirmationService);

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private actionsSubject: ActionsSubject
  ) {
    this.newClienteForm = this.fb.group({
      IdUsuario: [''],
      Nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });


    this.detailClienteForm = this.fb.group({
      Id: [''],
      IdUsuario: [''],
      Nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });

  }

  ngOnInit(): void {

    this.store.select(selectUserId).pipe(takeUntil(this.destroy$)).subscribe((idUsuario: number) => {
      this.idUsuario = idUsuario
    });

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const idString = params.get('id');
      if (idString !== null) {
        const id = parseInt(idString, 10);
        this.clienteId = id;
        if (id === 0) {
          this.isNewCliente = true;
          this.clientePorId$ = of(null);
        } else {
          this.store.dispatch(ClienteDetailActions.GetCliente({ id: id }));
          this.clientePorId$ = this.store.select(ClienteSelector.selectedClienteSelector);
        }
      }
    });
    this.clientePorId$ = this.store.select(ClienteSelector.selectedClienteSelector);

    this.clientePorId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cliente: Cliente | null) => {
        if (cliente) {
          this.detailClienteForm.patchValue({
            ...cliente,
          });
          this.originalClienteData = { ...cliente };
        }
      });

    this.store.select(ClienteSelector.selectLoading).pipe(takeUntil(this.destroy$)).subscribe((loading: boolean) => {
      this.loading = loading;
    });
    this.error$ = this.store.select(ClienteSelector.selectErrorCarga);

    this.actionsSubject.pipe(filter(action => action.type === 'CreateClienteSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.router.navigate(['clientes/cliente-detail', action.cliente.Item.Id])
        this.isNewCliente = false;
        this.detailClienteForm.patchValue(action.Item);
      });
    this.detailClienteForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });

    this.newClienteForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit() {
    const formValue = this.isNewCliente ? this.newClienteForm.value : this.detailClienteForm.value;
    formValue.IdUsuario = this.idUsuario;

    if (this.isNewCliente) {
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
          this.createCliente(formValue);
        } else {
          this.updateCliente(formValue);
        }
      }
    });
  }

  private createCliente(formValue: any) {
    const newClienteData = { ...formValue };
    this.store.dispatch(ClienteDetailActions.CreateCliente({ payload: newClienteData }));
    this.deshabilitarBoton = true;
  }

  private updateCliente(formValue: any) {
    const updatedClienteData = { ...formValue };
    updatedClienteData.Id = this.originalClienteData.Id;
    this.store.dispatch(ClienteDetailActions.UpdateCliente({ cliente: updatedClienteData }));
    this.detailClienteForm.markAsPristine();
    this.deshabilitarBoton = true;
  }

  goBack(): void {
    this.router.navigate(['clientes/clientes-list']);
  }

  onCategoriaChange(event: any) {
    const selectedCategory = event.value;
    this.newClienteForm.get('Categoria')?.patchValue({
      Id: selectedCategory?.Id || '',
      Nombre: selectedCategory?.Nombre || '',
      Descripcion: selectedCategory?.Descripcion || ''
    });
  }

}
