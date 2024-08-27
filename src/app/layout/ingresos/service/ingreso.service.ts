import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingreso } from 'src/app/shared/models/entidades/ingreso.model';
import { HttpParams } from '@angular/common/http';
import { ResponseData } from 'src/app/shared/models/entidades/responseData.model';
import { BaseService } from 'src/app/shared/service/base-service.service';
import { ResponseOne } from 'src/app/shared/models/entidades/responseOne.model';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { Persona } from 'src/app/shared/models/entidades/persona.model';
import { FormaPago } from 'src/app/shared/models/entidades/formaPago.model';
import { Cliente } from 'src/app/shared/models/entidades/cliente.model';
import { Concepto } from 'src/app/shared/models/entidades/concepto.model';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  // apiUrl = 'https://gastosapp-backend.onrender.com/api/';
  apiUrl = 'https://localhost:7115/api/'
  constructor(private http: HttpClient) { }

  getAll(): Observable<Ingreso[]> {
    const url = `${this.apiUrl}ingreso`;
    return this.http.get<Ingreso[]>(url);
  }

  getCantidad(page: number, size: number, idUsuario: number): Observable<ResponseData<Ingreso>> {
    const url = `${this.apiUrl}ingreso/getCantidad`;

    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('idUsuario', idUsuario)

    return this.http.get<ResponseData<Ingreso>>(url, { params });

  }

  getById(id: number): Observable<Ingreso> {
    const url = `${this.apiUrl}ingreso/${id}`;
    return this.http.get<Ingreso>(url);
  }

  update(ingreso: Partial<Ingreso>): Observable<Ingreso> {
    const url = `${this.apiUrl}ingreso/${ingreso.Id}`;
    return this.http.put<Ingreso>(url, ingreso);
  }

  delete(id: number): Observable<Ingreso> {
    const url = `${this.apiUrl}ingreso/${id}`;
    return this.http.delete<Ingreso>(url);
  }

  create(ingreso: Ingreso): Observable<ResponseOne<Ingreso>> {
    return this.http.post<ResponseOne<Ingreso>>(`${this.apiUrl}ingreso`, ingreso);
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

  getClientes(idUsuario: number): Observable<ResponseData<Cliente>> {
    const url = `${this.apiUrl}cliente/getClientes/${idUsuario}`;
    return this.http.get<ResponseData<Cliente>>(url);
  }

  getConceptos(idUsuario: number): Observable<ResponseData<Concepto>> {
    const url = `${this.apiUrl}concepto/getConceptos/${idUsuario}`;
    return this.http.get<ResponseData<Concepto>>(url);
  }

  exportExcel(res: Excel): Observable<any> {
    const url = `${this.apiUrl}ingreso/exportExcel`;

    return this.http.post<Excel>(url, res);
  }

}
