import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, takeUntil } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from 'src/app/shared/models/entidades/usuario.model';
import { ActionsSubject, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import * as UsuarioDetailActions from '../ngrx/usuario-detail.actions';
import * as UsuarioSelector from '../ngrx/usuario-detail.selectors';
import { Location } from '@angular/common';
import { selectUsuarioPorId } from 'src/app/shared/menu/ngrx/selectors/menu.selectors';
import { UsuarioDetailState } from 'src/app/shared/models/entidades/estados/usuarioDetailState.model';
import { MenuState } from 'src/app/shared/models/entidades/estados/menustate.model';

@Component({
  selector: 'app-usuario-detail',
  templateUrl: './usuario-detail.component.html',
  styleUrls: ['./usuario-detail.component.css']
})
export class UsuarioDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  usuarioPorId$!: Observable<Usuario | null>;
  loading: boolean = false;
  error$!: Observable<boolean>;
  detailUsuarioForm: FormGroup;
  originalUsuarioData!: Usuario;
  selectedOption!: string;
  idUsuario!: number;
  showConfirmationDialog: boolean = false;

  constructor(
    private store: Store<UsuarioDetailState>,
    private _store: Store<MenuState>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private actionsSubject: ActionsSubject,
  ) {

    this.detailUsuarioForm = this.fb.group({
      Id: [''],
      Correo: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
      NuevaContrasena: ['', [Validators.minLength(5), Validators.maxLength(200)]],
      Contrasena: [''],
    });

  }

  ngOnInit(): void {

    this._store.select(selectUsuarioPorId).pipe(takeUntil(this.destroy$)).subscribe((usuario: Usuario | null) => {
      if (usuario) {
        this.detailUsuarioForm.patchValue({
          ...usuario,
        });
        this.originalUsuarioData = { ...usuario };
      }
    });

    this.store.select(UsuarioSelector.selectLoading).pipe(takeUntil(this.destroy$)).subscribe((loading: boolean) => {
      this.loading = loading;
    });

    this.error$ = this.store.select(UsuarioSelector.selectErrorCarga);

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit() {
    // Obtén el valor del formulario basado en si es una nueva usuario o una usuario existente
    const formValue = this.detailUsuarioForm.value;
    if (this.detailUsuarioForm.value.NuevaContrasena.length > 0) {
      this.detailUsuarioForm.value.Contrasena = this.detailUsuarioForm.value.NuevaContrasena
    }
    // Crea un nuevo objeto con el Saldo formateado
    const formattedFormValue = {
      ...formValue,
    };

    const updatedUsuarioData = { ...formattedFormValue };
    this.store.dispatch(UsuarioDetailActions.UpdateUsuario({ usuario: updatedUsuarioData }));
    this.detailUsuarioForm.markAsPristine();

  }

  onDeleteUsuario() {
    this.showConfirmationDialog = false;
    this.store.dispatch(UsuarioDetailActions.DeleteUsuario({ id: this.detailUsuarioForm.value.Id }));
  }

  getDialogWidth(): string {
    const maxWidthSmallScreens = 300;

    // Obtener el ancho de la ventana del navegador
    const windowWidth = window.innerWidth;

    // Si la ventana es menor que un cierto tamaño, devuelve el ancho máximo para pantallas pequeñas
    if (windowWidth < 576) {
      return `${maxWidthSmallScreens}px`;
    }

    // Si no, devuelve el ancho predeterminado del diálogo
    return '25rem';
  }

  addBlur() {
    document.body.classList.add('blur-background');
  }

  removeBlur() {
    document.body.classList.remove('blur-background');
  }
}
