import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionsSubject, Store } from '@ngrx/store';
import * as AuthActions from '../../ngrx/auth.actions';
import { filter, Subject, takeUntil } from 'rxjs';
import { selectAuthLoading } from '../../ngrx/auth.selectors';
import { AppState } from 'src/app/app.state';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';
  deshabilitarBoton: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<AuthState>,
    private actionsSubject: ActionsSubject
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      Correo: ['', [Validators.required, Validators.email]],
      Contrasena: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.actionsSubject.pipe(filter(action => action.type == '[Auth] Sign Up Success'))
      .subscribe((action: any) => {
        this.router.navigate(['/home'])
      });

    this.registerForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });

    this.registerForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
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

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }    
    const { Correo, Contrasena } = this.registerForm.value;

    this.store.dispatch(AuthActions.signUp({ Correo, Contrasena }));
    this.registerForm.markAsPristine();
    this.deshabilitarBoton = true;
  }
}
