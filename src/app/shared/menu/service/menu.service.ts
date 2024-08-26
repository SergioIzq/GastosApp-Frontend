import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../models/entidades/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  apiUrl = 'https://gastosapp-backend.onrender.com/api/';

  constructor(private http: HttpClient) { }

  getById(id: number): Observable<Usuario> {
    const url = `${this.apiUrl}usuario/${id}`;

    return this.http.get<Usuario>(url);
  }

}
