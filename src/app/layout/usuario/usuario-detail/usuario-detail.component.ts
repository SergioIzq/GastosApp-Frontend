import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, takeUntil, of, switchMap } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from 'src/app/shared/models/entidades/usuario.model';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import * as UsuarioDetailActions from '../ngrx/usuario-detail.actions';
import * as UsuarioSelector from '../ngrx/usuario-detail.selectors';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { NumberFormatterPipe } from 'src/app/shared/pipes/numberFormatterPipe.pipe';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import { selectUsuarioPorId } from 'src/app/shared/menu/ngrx/selectors/menu.selectors';
import { GetUsuario } from 'src/app/shared/menu/ngrx/actions/menu.actions';

@Component({
  selector: 'app-usuario-detail',
  templateUrl: './usuario-detail.component.html',
  styleUrls: ['./usuario-detail.component.css']
})
export class UsuarioDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  usuarioPorId$!: Observable<Usuario | null>;
  cargando$!: Observable<boolean>;
  error$!: Observable<boolean>;
  detailUsuarioForm: FormGroup;
  originalUsuarioData!: Usuario;
  selectedOption!: string;
  idUsuario!: number;
  showConfirmationDialog: boolean = false;

  constructor(
    private store: Store<AppState>,
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

    this.store.select(selectUsuarioPorId).pipe(takeUntil(this.destroy$)).subscribe((usuario: Usuario | null) => {
      if (usuario) {
        this.detailUsuarioForm.patchValue({
          ...usuario,
        });        
        this.originalUsuarioData = { ...usuario };
      }
    });

    this.cargando$ = this.store.select(UsuarioSelector.selectCargando);
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

}
