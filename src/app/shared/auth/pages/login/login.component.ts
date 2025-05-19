import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionsSubject, Store, select } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import * as AuthActions from '../../ngrx/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../ngrx/auth.selectors';
import { AuthService } from '../../service/auth.service';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading: boolean = false;
  error$: Observable<string | null>;
  deshabilitarBoton: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  correoForm!: FormGroup;
  mostrarDialogo: boolean = false;
  dialogHeader: string = '';
  tipoDialogo: 'recuperar' | 'confirmar' = 'recuperar';

  constructor(
    private fb: FormBuilder,
    private store: Store<AuthState>,
    private router: Router,
    private actionsSubject: ActionsSubject,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      Correo: ['', [Validators.required, Validators.email]],
      Contrasena: ['', Validators.required]
    });

    this.correoForm = this.fb.group({
      Correo: ['', [Validators.required, Validators.email]],
    });

    this.error$ = this.store.pipe(select(selectAuthError));
  }

  ngOnInit() {
    this.actionsSubject.pipe(filter(action => action.type === '[Auth] Login Success'))
      .subscribe((action: any) => {
        if (action.respuesta.token) {
          this.authService.setToken(action.respuesta.token);
        }
        this.router.navigate(['/home']);
      });

    this.actionsSubject.pipe(filter(action => action.type === 'reenviarConfirmacionSuccess'))
      .subscribe((action: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Operación exitosa',
          detail: 'Email de activación de cuenta enviado.',
          life: 5000
        });
      });

    this.actionsSubject.pipe(filter(action => action.type === 'recuperarPasswordCorreoSuccess'))
      .subscribe((action: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Operación exitosa',
          detail: 'Email de recuperación de contraseña enviado.',
          life: 5000
        });
      });

    this.loginForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });

    this.store.select(selectAuthLoading).pipe(takeUntil(this.destroy$)).subscribe((loading: boolean) => {
      this.loading = loading;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { Correo, Contrasena } = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ Correo, Contrasena }));
      this.deshabilitarBoton = true;
    }
  }

  abrirDialogo(tipo: 'recuperar' | 'confirmar') {
    this.tipoDialogo = tipo;
    this.dialogHeader = tipo === 'recuperar' ? 'Recuperar contraseña' : 'Reenviar correo de confirmación';
    this.correoForm.reset();
    this.mostrarDialogo = true;
  }

  enviarCorreo() {
    if (this.correoForm.valid) {
      const correo = this.correoForm.value.Correo;

      if (this.tipoDialogo === 'recuperar') {
        this.store.dispatch(AuthActions.recuperarPasswordCorreo({ correo }));
      } else {
        this.store.dispatch(AuthActions.reenviarConfirmacion({ correo }));
      }

      this.mostrarDialogo = false;
    }
  }
}
