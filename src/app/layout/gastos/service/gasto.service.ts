import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gasto } from 'src/app/shared/models/entidades/gasto.model';
import { HttpParams } from '@angular/common/http';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/responseData.model';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/responseOne.model';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';
import { GastoRespuesta } from 'src/app/shared/models/entidades/respuestas/gastoRespuesta.model';
import { GastoByIdRespuesta } from 'src/app/shared/models/entidades/respuestas/gastoByIdRespuesta.model';
import { environment } from 'src/environments/environment';
import { GastoProgramado } from 'src/app/shared/models/entidades/gastoProgramado.model';
import { GastoProgramadoByIdRespuesta } from 'src/app/shared/models/entidades/respuestas/gastoProgramadoByIdRespuesta.model';

@Injectable({
  providedIn: 'root'
})
export class GastoService {

  apiUrl = environment.apiUrl;

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

  getCantidadGastosProgramados(page: number, size: number, idUsuario: number): Observable<ResponseData<GastoProgramado>> {
    const url = `${this.apiUrl}gastoProgramado/getCantidad`;

    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('idUsuario', idUsuario)

    return this.http.get<ResponseData<GastoProgramado>>(url, { params });

  }

  getById(id: number): Observable<GastoByIdRespuesta> {
    const url = `${this.apiUrl}gasto/getById/${id}`;
    return this.http.get<GastoByIdRespuesta>(url);
  }

  getGastoProgramadoById(id: number): Observable<GastoProgramadoByIdRespuesta> {
    const url = `${this.apiUrl}gastoProgramado/getById/${id}`;
    return this.http.get<GastoProgramadoByIdRespuesta>(url);
  }

  update(gasto: Partial<Gasto>): Observable<Gasto> {
    const url = `${this.apiUrl}gasto/${gasto.Id}`;
    return this.http.put<Gasto>(url, gasto);
  }

  updateGastoProgramado(gastoProgramado: Partial<GastoProgramado>): Observable<GastoProgramado> {
    const url = `${this.apiUrl}gastoProgramado/${gastoProgramado.Id}`;
    return this.http.put<GastoProgramado>(url, gastoProgramado);
  }

  delete(id: number): Observable<Gasto> {
    const url = `${this.apiUrl}gasto/${id}`;
    return this.http.delete<Gasto>(url);
  }

  deleteProgramado(id: number): Observable<GastoProgramado> {
    const url = `${this.apiUrl}gastoProgramado/${id}`;
    return this.http.delete<GastoProgramado>(url);
  }

  create(gasto: Gasto): Observable<ResponseOne<Gasto>> {
    return this.http.post<ResponseOne<Gasto>>(`${this.apiUrl}gasto`, gasto);
  }

  createGastoProgramado(gastoProgramado: GastoProgramado): Observable<ResponseOne<GastoProgramado>> {
    return this.http.post<ResponseOne<GastoProgramado>>(`${this.apiUrl}gastoProgramado`, gastoProgramado);
  }

  exportExcel(res: Excel): Observable<any> {
    const url = `${this.apiUrl}gasto/exportExcel`;

    return this.http.post<Excel>(url, res);
  }

  getNewGasto(idUsuario: number): Observable<GastoRespuesta>{    
    const url = `${this.apiUrl}gasto/getNewGasto/${idUsuario}`;
    return this.http.get<GastoRespuesta>(url);
  }
}
