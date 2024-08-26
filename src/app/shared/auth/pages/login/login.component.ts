import { Component, OnInit } from '@angular/core';
import { ActionsSubject, Store, select } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, Observable } from 'rxjs';
import * as AuthActions from '../../ngrx/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../ngrx/auth.selectors';
import { AppState } from 'src/app/app.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private actionsSubject: ActionsSubject
  ) {
    this.loginForm = this.fb.group({
      Correo: ['', [Validators.required, Validators.email]],
      Contrasena: ['', Validators.required]
    });

    this.loading$ = this.store.pipe(select(selectAuthLoading));
    this.error$ = this.store.pipe(select(selectAuthError));
  }

  ngOnInit() {
    this.actionsSubject.pipe(filter(action => action.type == '[Auth] Login Success'))
      .subscribe((action: any) => {
        this.router.navigate(['/home'])                
      });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { Correo, Contrasena } = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ Correo, Contrasena }));      
    }
  }


}
