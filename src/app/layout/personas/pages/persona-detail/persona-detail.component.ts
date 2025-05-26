import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, takeUntil, of } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Persona } from 'src/app/shared/models/entidades/persona.model';
import { ActionsSubject, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import * as PersonaDetailActions from '../../ngrx/actions/persona-detail.actions';
import * as PersonaSelector from '../../ngrx/selectors/persona-detail.selectors';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseOne.model';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PersonaDetailState } from 'src/app/shared/models/entidades/estados/personaDetail.model';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';

@Component({
  selector: 'app-persona-detail',
  templateUrl: './persona-detail.component.html',
  styleUrls: ['./persona-detail.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class PersonaDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  personaId: number = 0;
  personaPorId$!: Observable<Persona | null>;
  loading: boolean = false;
  error$!: Observable<boolean>;
  detailPersonaForm: FormGroup;
  originalPersonaData!: Persona;
  isNewPersona: boolean = false;
  newPersonaForm!: FormGroup;
  createdSuccess$!: Observable<boolean>;
  createdPersona$!: Observable<ResponseOne<Persona> | null>;
  selectedOption!: string;
  idUsuario!: number;
  deshabilitarBoton: boolean = false;
  private _confirmationService: ConfirmationService = inject(ConfirmationService);

  constructor(
    private store: Store<PersonaDetailState>,
    private _store: Store<AuthState>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private actionsSubject: ActionsSubject,
  ) {
    this.newPersonaForm = this.fb.group({
      IdUsuario: [''],
      Nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });


    this.detailPersonaForm = this.fb.group({
      Id: [''],
      IdUsuario: [''],
      Nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });

  }

  ngOnInit(): void {

    this._store.select(selectUserId).pipe(takeUntil(this.destroy$)).subscribe((idUsuario: number) => {
      this.idUsuario = idUsuario;
    });

    this.actionsSubject.pipe(filter(action => action.type === 'CreatePersonaSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.router.navigate(['personas/persona-detail', action.persona.Item.Id])
        this.isNewPersona = false;
        this.detailPersonaForm.patchValue(action.Item);
      });

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const idString = params.get('id');
      if (idString !== null) {
        const id = parseInt(idString, 10);
        this.personaId = id;
        if (id === 0) {
          this.isNewPersona = true;
          this.personaPorId$ = of(null);
        } else {
          this.isNewPersona = false;
          this.store.dispatch(PersonaDetailActions.GetPersona({ id: id }));
          this.personaPorId$ = this.store.select(PersonaSelector.selectedPersonaSelector);
        }
      }
    });
    this.personaPorId$ = this.store.select(PersonaSelector.selectedPersonaSelector);

    this.personaPorId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((persona: Persona | null) => {
        if (persona) {
          this.detailPersonaForm.patchValue({
            ...persona,
          });
          this.originalPersonaData = { ...persona };
        }
      });

    this.store.select(PersonaSelector.selectLoading).pipe(takeUntil(this.destroy$)).subscribe((loading: boolean) => {
      this.loading = loading;
    });

    this.error$ = this.store.select(PersonaSelector.selectErrorCarga);

    this.detailPersonaForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });

    this.newPersonaForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit() {
    const formValue = this.isNewPersona ? this.newPersonaForm.value : this.detailPersonaForm.value;
    formValue.IdUsuario = this.idUsuario;

    if (this.isNewPersona) {
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
          this.createPersona(formValue);
        } else {
          this.updatePersona(formValue);
        }
      }
    });
  }

  private createPersona(formValue: any) {
    const newPersonaData = { ...formValue };
    this.store.dispatch(PersonaDetailActions.CreatePersona({ payload: newPersonaData }));
    this.deshabilitarBoton = true;
  }

  private updatePersona(formValue: any) {
    const updatedPersonaData = { ...formValue };
    updatedPersonaData.Id = this.originalPersonaData.Id;
    this.store.dispatch(PersonaDetailActions.UpdatePersona({ persona: updatedPersonaData }));
    this.detailPersonaForm.markAsPristine();
    this.deshabilitarBoton = true;
  }

  goBack(): void {
    this.router.navigate(['personas/personas-list']);
  }

  onPersonaChange(event: any) {
    const selectedCategory = event.value;
    this.newPersonaForm.get('Persona')?.patchValue({
      Id: selectedCategory?.Id || '',
      Nombre: selectedCategory?.Nombre || '',
      Descripcion: selectedCategory?.Descripcion || ''
    });
  }

  removeBlur() {
    document.body.classList.remove('blur-background');
  }
}
