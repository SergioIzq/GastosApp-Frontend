import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/shared/models/entidades/usuario.model';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/responseData.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAll(idUsuario: number): Observable<ResponseData<Usuario>> {
    const url = `${this.apiUrl}usuario/getUsuarios${idUsuario}`;
    return this.http.get<ResponseData<Usuario>>(url);
  }

  getById(id: number): Observable<Usuario> {
    const url = `${this.apiUrl}usuario/${id}`;

    return this.http.get<Usuario>(url);
  }

  update(usuario: Partial<Usuario>): Observable<Usuario> {
    const url = `${this.apiUrl}usuario/${usuario.Id}`;
    return this.http.put<any>(url, usuario);
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}usuario/${id}`;
    return this.http.delete<void>(url);
  }

}
