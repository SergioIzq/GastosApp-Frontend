import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthState } from '../models/entidades/estados/authState.model';
import { selectIsAuthenticated } from '../auth/ngrx/auth.selectors';
import { AppState } from '../../app.state';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select(selectIsAuthenticated),
      map(isAuthenticated => {
        if (isAuthenticated) {
          // logged in so return true
          return true;
        } else {
          // not logged in so redirect to login page
          this.router.navigate(['auth/login']);
          return false;
        }
      }),
      catchError(() => {
        // Handle any error here
        this.router.navigate(['auth//login']);
        return of(false);
      })
    );
  }
}
