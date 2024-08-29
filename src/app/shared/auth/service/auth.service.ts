import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    apiUrl = 'https://gastosapp-backend.onrender.com/api/';
    constructor(private http: HttpClient) { }

  login(correo: string, contrasena: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}auth/login`, { correo, contrasena });
  }

  signUp(correo: string, contrasena: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}auth/register`, { correo, contrasena });
  }
}
