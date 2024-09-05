import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, takeUntil, of, switchMap } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Concepto } from 'src/app/shared/models/entidades/concepto.model';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import * as ConceptoDetailActions from '../../ngrx/actions/concepto-detail.actions';
import * as ConceptoSelector from '../../ngrx/selectors/concepto-detail.selectors';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Categoria } from 'src/app/shared/models/entidades/categoria.model';
import { ResponseData } from 'src/app/shared/models/entidades/responseData.model';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';

@Component({
  selector: 'app-concepto-detail',
  templateUrl: './concepto-detail.component.html',
  styleUrls: ['./concepto-detail.component.css']
})
export class ConceptoDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  conceptoId: number = 0;
  conceptoPorId$!: Observable<Concepto | null>;
  loading: boolean = false;
  error$!: Observable<boolean>;
  detailConceptoForm: FormGroup;
  originalConceptoData!: Concepto;
  isNewConcepto: boolean = false;
  newConceptoForm!: FormGroup;
  categorias$!: Observable<ResponseData<Categoria> | null>
  categorias!: ResponseData<Categoria>;
  selectedOption!: string;
  idUsuario!: number;
  deshabilitarBoton: boolean = true;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private actionsSubject: ActionsSubject
  ) {
    this.newConceptoForm = this.fb.group({
      IdUsuario: [''],
      Nombre: ['', [Validators.required, Validators.maxLength(100)]],
      Categoria: ['', Validators.required]
    });


    this.detailConceptoForm = this.fb.group({
      Id: [''],
      IdUsuario: [''],
      Nombre: ['', [Validators.required, Validators.maxLength(100)]],
      Categoria: ['', Validators.required]
    });

    this.actionsSubject.pipe(filter(action => action.type === 'CreateConceptoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.router.navigate(['conceptos/concepto-detail', action.concepto.Item.Id])
        this.isNewConcepto = false;
      });
  }

  ngOnInit(): void {


    this.store.select(selectUserId).pipe(takeUntil(this.destroy$)).subscribe((idUsuario: number) => {
      this.idUsuario = idUsuario;
    });

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const idString = params.get('id');
      if (idString !== null) {
        const id = parseInt(idString, 10);
        this.conceptoId = id;
        if (id === 0) {
          this.isNewConcepto = true;
          this.conceptoPorId$ = of(null);
        } else {
          this.store.dispatch(ConceptoDetailActions.GetConcepto({ id: id }));
          this.conceptoPorId$ = this.store.select(ConceptoSelector.selectedConceptoSelector);
        }
      }
    });

    this.store.dispatch(ConceptoDetailActions.GetCategorias({ idUsuario: this.idUsuario }));
    this.conceptoPorId$ = this.store.select(ConceptoSelector.selectedConceptoSelector);

    this.categorias$ = this.store.select(ConceptoSelector.selectCategorias);
    this.categorias$
    .pipe(takeUntil(this.destroy$))
    .subscribe((categorias: ResponseData<Categoria> | null) => {
      if (categorias && categorias.Items) {
        const sortedItems = [...categorias.Items].sort((a: Categoria, b: Categoria) =>
          a.Nombre.localeCompare(b.Nombre)
        );
  
        this.categorias = {
          ...categorias,      
          Items: sortedItems 
        };
      }
    });  

    this.conceptoPorId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((concepto: Concepto | null) => {
        if (concepto) {
          // Encuentra la categoría seleccionada
          const selectedCategoria = this.categorias?.Items.find(categoria => categoria.Id === concepto.Categoria.Id);

          // Actualiza el formulario con el concepto y la categoría seleccionada
          this.detailConceptoForm.patchValue({
            ...concepto,
            Categoria: selectedCategoria
          });

          // Guarda el dato original del concepto
          this.originalConceptoData = { ...concepto };
        }
      });

    this.store.select(ConceptoSelector.selectLoading).pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.loading = loading;
    });

    this.error$ = this.store.select(ConceptoSelector.selectErrorCarga);

    this.detailConceptoForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });

    this.newConceptoForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit() {
    const formValue = this.isNewConcepto ? this.newConceptoForm.value : this.detailConceptoForm.value;
    formValue.IdUsuario = this.idUsuario;

    if (this.isNewConcepto) {
      const newConceptoData = { ...formValue };
      this.store.dispatch(ConceptoDetailActions.CreateConcepto({ payload: newConceptoData }));
      this.newConceptoForm.markAllAsTouched();
      this.deshabilitarBoton = true;
    } else {
      const updatedConceptoData = { ...formValue };
      updatedConceptoData.Id = this.originalConceptoData.Id;
      this.store.dispatch(ConceptoDetailActions.UpdateConcepto({ concepto: updatedConceptoData }));
      this.detailConceptoForm.markAsPristine();
      this.deshabilitarBoton = true;
    }
  }

  goBack(): void {
    this.router.navigate(['conceptos/conceptos-list']);
  }

}
