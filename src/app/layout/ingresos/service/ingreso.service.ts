import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingreso } from 'src/app/shared/models/entidades/ingreso.model';
import { HttpParams } from '@angular/common/http';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/responseData.model';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/responseOne.model';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';
import { IngresoRespuesta } from 'src/app/shared/models/entidades/respuestas/ingresoRespuesta.model';
import { IngresoByIdRespuesta } from 'src/app/shared/models/entidades/respuestas/ingresoByIdRespuesta.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  apiUrl = environment.apiUrl;

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

  getById(id: number): Observable<IngresoByIdRespuesta> {
    const url = `${this.apiUrl}ingreso/getById/${id}`;
    return this.http.get<IngresoByIdRespuesta>(url);
  }

  update(ingreso: Partial<Ingreso>): Observable<Ingreso> {
    const url = `${this.apiUrl}ingreso/${ingreso.Id}`;
    return this.http.put<Ingreso>(url, ingreso);
  }

  delete(id: number): Observable<Ingreso> {
    const url = `${this.apiUrl}ingreso/${id}`;
    return this.http.delete<Ingreso>(url);
  }

  create(ingreso: Ingreso): Observable<ResponseOne<IngresoByIdRespuesta>> {
    return this.http.post<ResponseOne<IngresoByIdRespuesta>>(`${this.apiUrl}ingreso`, ingreso);
  }

  exportExcel(res: Excel): Observable<any> {
    const url = `${this.apiUrl}ingreso/exportExcel`;

    return this.http.post<Excel>(url, res);
  }

  getNewIngreso(idUsuario: number): Observable<IngresoRespuesta>{    
    const url = `${this.apiUrl}ingreso/getNewIngreso/${idUsuario}`;
    return this.http.get<IngresoRespuesta>(url);
  }
}
