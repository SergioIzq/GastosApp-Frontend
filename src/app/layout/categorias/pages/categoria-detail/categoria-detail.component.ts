import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, takeUntil, of, switchMap } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Categoria } from 'src/app/shared/models/entidades/categoria.model';
import { Store, ActionsSubject } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import * as CategoriaDetailActions from '../../ngrx/actions/categoria-detail.actions';
import * as CategoriaSelector from '../../ngrx/selectors/categoria-detail.selectors';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoriaDetailState } from 'src/app/shared/models/entidades/estados/categoriaDetail.model';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';

@Component({
  selector: 'app-categoria-detail',
  templateUrl: './categoria-detail.component.html',
  styleUrls: ['./categoria-detail.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class CategoriaDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  categoriaId: number = 0;
  categoriaPorId$!: Observable<Categoria | null>;
  loading: boolean = false;
  error$!: Observable<boolean>;
  detailCategoriaForm: FormGroup;
  originalCategoriaData!: Categoria;
  isNewCategoria: boolean = false;
  newCategoriaForm!: FormGroup;
  IdUsuario!: number;
  deshabilitarBoton: boolean = false;
  private _confirmationService: ConfirmationService = inject(ConfirmationService);

  constructor(
    private store: Store<CategoriaDetailState>,
    private _store: Store<AuthState>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private actionsSubject: ActionsSubject
  ) {
    this.newCategoriaForm = this.fb.group({
      IdUsuario: [''],
      Nombre: ['', [Validators.required, Validators.maxLength(100)]],
      Descripcion: ['', Validators.maxLength(200)]
    });
    this.detailCategoriaForm = this.fb.group({
      IdUsuario: [''],
      Nombre: ['', [Validators.required, Validators.maxLength(100)]],
      Descripcion: ['', Validators.maxLength(200)]
    });


  }

  ngOnInit(): void {

    this._store.select(selectUserId).pipe(takeUntil(this.destroy$)).subscribe((idUsuario: number) => {
      this.IdUsuario = idUsuario;
    });

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const idString = params.get('id');
      if (idString !== null) {
        const id = parseInt(idString, 10);
        this.categoriaId = id;
        if (id === 0) {
          this.isNewCategoria = true;
          this.categoriaPorId$ = of(null);
        } else {
          this.store.dispatch(CategoriaDetailActions.GetCategoria({ id: id }));
          this.categoriaPorId$ = this.store.select(CategoriaSelector.selectedCategoriaSelector);
        }
      } 
    });

    this.categoriaPorId$ = this.store.select(CategoriaSelector.selectedCategoriaSelector);

    this.categoriaPorId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((categoria: Categoria | null) => {
        if (categoria) {
          this.detailCategoriaForm.patchValue({
            ...categoria,
          });
          this.originalCategoriaData = { ...categoria };
        }
      });

    this.store.select(CategoriaSelector.selectLoading).pipe(takeUntil(this.destroy$)).subscribe((loading: boolean) => {
      this.loading = loading;
    });

    this.error$ = this.store.select(CategoriaSelector.selectErrorCarga);

    this.actionsSubject.pipe(filter(action => action.type === 'CreateCategoriaSuccess'), (takeUntil(this.destroy$)))
      .subscribe((action: any) => {
        this.router.navigate(['categorias/categoria-detail', action.categoria.Item.Id])
        this.isNewCategoria = false;
        this.detailCategoriaForm.patchValue(action.Item);
        this.detailCategoriaForm.markAsPristine();
      });
    this.detailCategoriaForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });

    this.newCategoriaForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

onSubmit() {
    const formValue = this.isNewCategoria ? this.newCategoriaForm.value : this.detailCategoriaForm.value;
    formValue.IdUsuario = this.IdUsuario;

    if (this.isNewCategoria) {
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
          this.createCategoria(formValue);
        } else {
          this.updateCategoria(formValue);
        }
      }
    });
  }

  private createCategoria(formValue: any) {
    const newCategoriaData = { ...formValue };
    this.store.dispatch(CategoriaDetailActions.CreateCategoria({ payload: newCategoriaData }));
    this.deshabilitarBoton = true;
  }

  private updateCategoria(formValue: any) {
    const updatedCategoriaData = { ...formValue };
    updatedCategoriaData.Id = this.originalCategoriaData.Id;
    this.store.dispatch(CategoriaDetailActions.UpdateCategoria({ categoria: updatedCategoriaData }));
    this.detailCategoriaForm.markAsPristine();
    this.deshabilitarBoton = true;
  }

  goBack(): void {
    this.router.navigate(['categorias/categorias-list']);
  }

}
