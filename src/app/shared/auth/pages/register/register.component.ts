import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionsSubject, Store } from '@ngrx/store';
import * as AuthActions from '../../ngrx/auth.actions';
import { AuthState } from 'src/app/shared/models/entidades/estados/authState.model';
import { filter } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<AuthState>,
    private actionsSubject: ActionsSubject
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      Correo: ['', [Validators.required, Validators.email]],
      Contrasena: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.actionsSubject.pipe(filter(action => action.type == '[Auth] Sign Up Success'))
    .subscribe((action: any) => {
      this.router.navigate(['/home'])
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const { Correo, Contrasena } = this.registerForm.value;

    this.store.dispatch(AuthActions.signUp({ Correo, Contrasena }));
    this.registerForm.markAsPristine();
  }
}
