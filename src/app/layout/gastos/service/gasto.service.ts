import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gasto } from 'src/app/shared/models/entidades/gasto.model';
import { HttpParams } from '@angular/common/http';
import { ResponseData } from 'src/app/shared/models/entidades/responseData.model';
import { ResponseOne } from 'src/app/shared/models/entidades/responseOne.model';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { Persona } from 'src/app/shared/models/entidades/persona.model';
import { FormaPago } from 'src/app/shared/models/entidades/formaPago.model';
import { Proveedor } from 'src/app/shared/models/entidades/proveedor.model';
import { Concepto } from 'src/app/shared/models/entidades/concepto.model';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';

@Injectable({
  providedIn: 'root'
})
export class GastoService {

  apiUrl = 'https://gastosapp-backend.onrender.com/api/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Gasto[]> {
    const url = `${this.apiUrl}gasto`;
    return this.http.get<Gasto[]>(url);
  }

  getCantidad(page: number, size: number, idUsuario: number): Observable<ResponseData<Gasto>> {
    const url = `${this.apiUrl}gasto/getCantidad`;

    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('idUsuario', idUsuario)

    return this.http.get<ResponseData<Gasto>>(url, { params });

  }

  getById(id: number): Observable<Gasto> {
    const url = `${this.apiUrl}gasto/${id}`;
    return this.http.get<Gasto>(url);
  }

  update(gasto: Partial<Gasto>): Observable<Gasto> {
    const url = `${this.apiUrl}gasto/${gasto.Id}`;
    return this.http.put<Gasto>(url, gasto);
  }

  delete(id: number): Observable<Gasto> {
    const url = `${this.apiUrl}gasto/${id}`;
    return this.http.delete<Gasto>(url);
  }

  create(gasto: Gasto): Observable<ResponseOne<Gasto>> {
    return this.http.post<ResponseOne<Gasto>>(`${this.apiUrl}gasto`, gasto);
  }

  getCuentas(idUsuario: number): Observable<ResponseData<Cuenta>> {
    const url = `${this.apiUrl}cuenta/getCuentas/${idUsuario}`;
    return this.http.get<ResponseData<Cuenta>>(url);
  }

  getPersonas(idUsuario: number): Observable<ResponseData<Persona>> {
    const url = `${this.apiUrl}persona/getPersonas/${idUsuario}`;
    return this.http.get<ResponseData<Persona>>(url);
  }

  getFormasPago(idUsuario: number): Observable<ResponseData<FormaPago>> {
    const url = `${this.apiUrl}formapago/getFormaPago/${idUsuario}`;
    return this.http.get<ResponseData<FormaPago>>(url);
  }

  getProveedores(idUsuario: number): Observable<ResponseData<Proveedor>> {
    const url = `${this.apiUrl}proveedor/getProveedores/${idUsuario}`;
    return this.http.get<ResponseData<Proveedor>>(url);
  }

  getConceptos(idUsuario: number): Observable<ResponseData<Concepto>> {
    const url = `${this.apiUrl}concepto/getConceptos/${idUsuario}`;
    return this.http.get<ResponseData<Concepto>>(url);
  }

  exportExcel(res: Excel): Observable<any> {
    const url = `${this.apiUrl}gasto/exportExcel`;

    return this.http.post<Excel>(url, res);
  }
}
