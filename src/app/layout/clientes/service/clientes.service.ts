import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/shared/models/entidades/cliente.model';
import { HttpParams } from '@angular/common/http';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseOne.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAll(): Observable<ResponseData<Cliente>> {
    const url = `${this.apiUrl}cliente`;
    return this.http.get<ResponseData<Cliente>>(url);
  }

  getCantidad(page: number, size: number, idUsuario: number): Observable<ResponseData<Cliente>> {
    const url = `${this.apiUrl}cliente/getCantidad`;

    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('idUsuario', idUsuario)

    return this.http.get<ResponseData<Cliente>>(url, { params });
  }

  getById(id: number): Observable<Cliente> {
    const url = `${this.apiUrl}cliente/${id}`;
    return this.http.get<Cliente>(url);
  }

  update(cliente: Partial<Cliente>): Observable<Cliente> {
    const url = `${this.apiUrl}cliente/${cliente.Id}`;
    return this.http.put<any>(url, cliente);
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}cliente/${id}`;
    return this.http.delete<void>(url);
  }

  create(cliente: Cliente): Observable<ResponseOne<Cliente>> {
    return this.http.post<ResponseOne<Cliente>>(`${this.apiUrl}cliente`, cliente);
  }

}
