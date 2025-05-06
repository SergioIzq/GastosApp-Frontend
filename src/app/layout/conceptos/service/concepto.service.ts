import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Concepto } from 'src/app/shared/models/entidades/concepto.model';
import { HttpParams } from '@angular/common/http';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseOne.model';
import { Categoria } from 'src/app/shared/models/entidades/categoria.model';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConceptoService {

  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAll(): Observable<ResponseData<Concepto>> {
    const url = `${this.apiUrl}concepto`;
    return this.http.get<ResponseData<Concepto>>(url);
  }

  getCantidad(page: number, size: number, idUsuario: number): Observable<ResponseData<Concepto>> {
    const url = `${this.apiUrl}concepto/getCantidad`;

    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('idUsuario', idUsuario);

    return this.http.get<ResponseData<Concepto>>(url, { params });
  }

  getById(id: number): Observable<Concepto> {
    const url = `${this.apiUrl}concepto/${id}`;
    return this.http.get<Concepto>(url);
  }

  update(concepto: Partial<Concepto>): Observable<Concepto> {
    const url = `${this.apiUrl}concepto/${concepto.Id}`;
    return this.http.put<any>(url, concepto);
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}concepto/${id}`;
    return this.http.delete<void>(url);
  }

  create(concepto: Concepto): Observable<ResponseOne<Concepto>> {
    return this.http.post<ResponseOne<Concepto>>(`${this.apiUrl}concepto`, concepto);
  }

  getCategorias(idUsuario: number): Observable<ResponseData<Categoria>> {    
    const url = `${this.apiUrl}categoria/getCategorias/${idUsuario}`;
    return this.http.get<ResponseData<Categoria>>(url);
  }

  exportExcel(res: Excel): Observable<any> {
    const url = `${this.apiUrl}concepto/exportExcel`;

    return this.http.post<Excel>(url, res);
  }

}
