import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { HttpParams } from '@angular/common/http';
import { ResponseData } from 'src/app/shared/models/entidades/responseData.model';
import { ResponseOne } from 'src/app/shared/models/entidades/responseOne.model';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  apiUrl = 'https://gastosapp-backend.onrender.com/api/';
  constructor(private http: HttpClient) { }

  getAll(idUsuario: number): Observable<ResponseData<Cuenta>> {
    const url = `${this.apiUrl}cuenta/getCuentas${idUsuario}`;
    return this.http.get<ResponseData<Cuenta>>(url);
  }

  getCantidad(page: number, size: number, idUsuario: number): Observable<ResponseData<Cuenta>> {
    const url = `${this.apiUrl}cuenta/getCantidad`;

    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('idUsuario', idUsuario)

    return this.http.get<ResponseData<Cuenta>>(url, { params });
  }

  getById(id: number): Observable<Cuenta> {
    const url = `${this.apiUrl}cuenta/${id}`;
    return this.http.get<Cuenta>(url);
  }

  update(cuenta: Partial<Cuenta>): Observable<Cuenta> {
    const url = `${this.apiUrl}cuenta/${cuenta.Id}`;
    return this.http.put<any>(url, cuenta);
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}cuenta/${id}`;
    return this.http.delete<void>(url);
  }

  create(cuenta: Cuenta): Observable<ResponseOne<Cuenta>> {
    return this.http.post<ResponseOne<Cuenta>>(`${this.apiUrl}cuenta`, cuenta);
  }

  exportExcel(res: Excel): Observable<any> {
    const url = `${this.apiUrl}cuenta/exportExcel`;

    return this.http.post<Excel>(url, res);
  }
}
