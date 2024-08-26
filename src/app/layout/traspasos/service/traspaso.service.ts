import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseData } from 'src/app/shared/models/entidades/responseData.model';
import { Traspaso } from '../../../shared/models/entidades/traspaso.model';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { ResponseOne } from 'src/app/shared/models/entidades/responseOne.model';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';

@Injectable({
  providedIn: 'root'
})
export class TraspasoService {

  private apiUrl = 'https://gastosapp-backend.onrender.com/api/';

  constructor(private http: HttpClient) { }

  realizarTraspaso(traspaso: Traspaso): Observable<ResponseOne<Traspaso>> {

    return this.http.post<ResponseOne<Traspaso>>(`${this.apiUrl}traspaso/realizarTraspaso`, traspaso);
  }

  getAll(): Observable<ResponseData<Traspaso>> {
    const url = `${this.apiUrl}traspaso`;
    return this.http.get<ResponseData<Traspaso>>(url);
  }

  getCuentas(idUsuario: number): Observable<ResponseData<Cuenta>> {
    const url = `${this.apiUrl}cuenta/getCuentas/${idUsuario}`;
    return this.http.get<ResponseData<Cuenta>>(url);
  }

  getCantidad(page: number, size: number, idUsuario: number): Observable<ResponseData<Traspaso>> {
    const url = `${this.apiUrl}traspaso/getCantidad`;

    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('idUsuario', idUsuario)

    return this.http.get<ResponseData<Traspaso>>(url, { params });
  }

  getById(id: number): Observable<Traspaso> {
    const url = `${this.apiUrl}traspaso/${id}`;
    return this.http.get<Traspaso>(url);
  }

  update(traspaso: Partial<Traspaso>): Observable<Traspaso> {
    const url = `${this.apiUrl}traspaso/${traspaso.Id}`;
    return this.http.put<Traspaso>(url, traspaso);
  }

  delete(id: number): Observable<Traspaso> {
    const url = `${this.apiUrl}traspaso/${id}`;
    return this.http.delete<Traspaso>(url);
  }

  exportExcel(res: Excel): Observable<any> {
    const url = `${this.apiUrl}traspaso/exportExcel`;

    return this.http.post<Excel>(url, res);
  }

}
