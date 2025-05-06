import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormaPago } from 'src/app/shared/models/entidades/formaPago.model';
import { HttpParams } from '@angular/common/http';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseOne.model';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormasPagoService {

  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAll(): Observable<ResponseData<FormaPago>> {
    const url = `${this.apiUrl}formapago`;
    return this.http.get<ResponseData<FormaPago>>(url);
  }

  getCantidad(page: number, size: number, idUsuario: number): Observable<ResponseData<FormaPago>> {
    const url = `${this.apiUrl}formapago/getCantidad`;

    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('idUsuario', idUsuario)

    return this.http.get<ResponseData<FormaPago>>(url, { params });
  }

  getById(id: number): Observable<FormaPago> {
    const url = `${this.apiUrl}formapago/${id}`;
    return this.http.get<FormaPago>(url);
  }

  update(formapago: Partial<FormaPago>): Observable<FormaPago> {
    const url = `${this.apiUrl}formapago/${formapago.Id}`;
    return this.http.put<any>(url, formapago);
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}formapago/${id}`;
    return this.http.delete<void>(url);
  }

  create(formapago: FormaPago): Observable<ResponseOne<FormaPago>> {
    return this.http.post<ResponseOne<FormaPago>>(`${this.apiUrl}formapago`, formapago);
  }

  exportExcel(res: Excel): Observable<any> {
    const url = `${this.apiUrl}formapago/exportExcel`;

    return this.http.post<Excel>(url, res);
  }

}
