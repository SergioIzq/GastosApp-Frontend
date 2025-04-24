import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor } from 'src/app/shared/models/entidades/proveedor.model';
import { HttpParams } from '@angular/common/http';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/responseData.model';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/responseOne.model';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  apiUrl = 'https://gastosapp-backend.onrender.com/api/';  
  constructor(private http: HttpClient) { }

  getAll(): Observable<ResponseData<Proveedor>> {
    const url = `${this.apiUrl}proveedor`;
    return this.http.get<ResponseData<Proveedor>>(url);
  }

  getCantidad(page: number, size: number, idUsuario: number): Observable<ResponseData<Proveedor>> {
    const url = `${this.apiUrl}proveedor/getCantidad`;

    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('idUsuario', idUsuario)
    return this.http.get<ResponseData<Proveedor>>(url, { params });
  }

  getById(id: number): Observable<Proveedor> {
    const url = `${this.apiUrl}proveedor/${id}`;
    return this.http.get<Proveedor>(url);
  }

  update(proveedor: Partial<Proveedor>): Observable<Proveedor> {
    const url = `${this.apiUrl}proveedor/${proveedor.Id}`;
    return this.http.put<any>(url, proveedor);
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}proveedor/${id}`;
    return this.http.delete<void>(url);
  }

  create(proveedor: Proveedor): Observable<ResponseOne<Proveedor>> {
    return this.http.post<ResponseOne<Proveedor>>(`${this.apiUrl}proveedor`, proveedor);
  }

  exportExcel(res: Excel): Observable<any> {
    const url = `${this.apiUrl}proveedor/exportExcel`;

    return this.http.post<Excel>(url, res);
  }

}
