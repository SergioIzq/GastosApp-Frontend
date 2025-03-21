import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionsSubject, Store, select } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import * as AuthActions from '../../ngrx/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../ngrx/auth.selectors';
import { AppState } from 'src/app/app.state';
import { AuthService } from '../../service/auth.service';

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

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private actionsSubject: ActionsSubject,
    private authService: AuthService // Inyectamos AuthService para manejar el token
  ) {
    this.loginForm = this.fb.group({
      Correo: ['', [Validators.required, Validators.email]],
      Contrasena: ['', Validators.required]
    });

    this.error$ = this.store.pipe(select(selectAuthError));
  }

  ngOnInit() {
    this.actionsSubject.pipe(filter(action => action.type === '[Auth] Login Success'))
      .subscribe((action: any) => {
        if (action.token) {
          this.authService.setToken(action.token.token); // Guarda el token y activa el temporizador
        }
        this.router.navigate(['/home']);
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
}
