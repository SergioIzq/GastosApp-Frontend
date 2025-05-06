import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/respuestas-genericas/responseData.model';
import { Traspaso } from '../../../shared/models/entidades/traspaso.model';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';
import { environment } from 'src/environments/environment';
import { TraspasoByIdRespuesta } from 'src/app/shared/models/entidades/respuestas/traspasos/traspasoByIdRespuesta.model';

@Injectable({
  providedIn: 'root'
})
export class TraspasoService {

  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  realizarTraspaso(traspaso: Traspaso): Observable<TraspasoByIdRespuesta> {
    return this.http.post<TraspasoByIdRespuesta>(`${this.apiUrl}traspaso/realizarTraspaso`, traspaso);
  }

  getAll(): Observable<ResponseData<Traspaso>> {
    const url = `${this.apiUrl}traspaso`;
    return this.http.get<ResponseData<Traspaso>>(url);
  }

  getNewTraspaso(idUsuario: number): Observable<Cuenta[]> {
    const url = `${this.apiUrl}traspaso/getNewTraspaso/${idUsuario}`;
    return this.http.get<Cuenta[]>(url);
  }

  getCantidad(page: number, size: number, idUsuario: number): Observable<ResponseData<Traspaso>> {
    const url = `${this.apiUrl}traspaso/getCantidad`;

    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('idUsuario', idUsuario)

    return this.http.get<ResponseData<Traspaso>>(url, { params });
  }

  getById(id: number): Observable<TraspasoByIdRespuesta> {
    const url = `${this.apiUrl}traspaso/getById/${id}`;
    return this.http.get<TraspasoByIdRespuesta>(url);
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
