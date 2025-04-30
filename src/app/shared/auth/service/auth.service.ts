import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import * as AuthActions from '../ngrx/auth.actions';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router, private messageService: MessageService, private store: Store) { }

  login(correo: string, contrasena: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}auth/login`, { correo, contrasena });
  }

  signUp(correo: string, contrasena: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}auth/register`, { correo, contrasena });
  }

  logout() {
    localStorage.removeItem('token');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['auth/login']);
  }

  public setToken(token: string) {
    localStorage.setItem('token', token);
    this.startTokenExpirationTimer(token);
  }

  private startTokenExpirationTimer(token: string) {
    const expirationTime = this.getTokenExpiration(token);
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;

    if (timeUntilExpiration > 0) {
      this.tokenExpirationTimer = setTimeout(() => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Sesión expirada',
          detail: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
          life: 8000
        });

        this.logout();
      }, timeUntilExpiration);
    } else {
      this.logout();
    }
  }

  private getTokenExpiration(token: any): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return 0;
    }
  }
}
