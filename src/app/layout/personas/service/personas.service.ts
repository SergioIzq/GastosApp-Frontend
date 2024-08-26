import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from 'src/app/shared/models/entidades/persona.model';
import { HttpParams } from '@angular/common/http';
import { ResponseData } from 'src/app/shared/models/entidades/responseData.model';
import { ResponseOne } from 'src/app/shared/models/entidades/responseOne.model';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  apiUrl = 'https://gastosapp-backend.onrender.com/api/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ResponseData<Persona>> {
    const url = `${this.apiUrl}persona`;
    return this.http.get<ResponseData<Persona>>(url);
  }

  getCantidad(page: number, size: number, idUsuario: number): Observable<ResponseData<Persona>> {
    const url = `${this.apiUrl}persona/getCantidad`;

    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('idUsuario', idUsuario)

    return this.http.get<ResponseData<Persona>>(url, { params });
  }

  getById(id: number): Observable<Persona> {
    const url = `${this.apiUrl}persona/${id}`;
    return this.http.get<Persona>(url);
  }

  update(persona: Partial<Persona>): Observable<Persona> {
    const url = `${this.apiUrl}persona/${persona.Id}`;
    return this.http.put<any>(url, persona);
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}persona/${id}`;
    return this.http.delete<void>(url);
  }

  create(persona: Persona): Observable<ResponseOne<Persona>> {
    return this.http.post<ResponseOne<Persona>>(`${this.apiUrl}persona`, persona);
  }

  exportExcel(res: Excel): Observable<any> {
    const url = `${this.apiUrl}persona/exportExcel`;

    return this.http.post<Excel>(url, res);
  }

}
