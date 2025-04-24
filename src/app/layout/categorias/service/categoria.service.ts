import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from 'src/app/shared/models/entidades/categoria.model';
import { ResponseData } from 'src/app/shared/models/entidades/respuestas/responseData.model';
import { ResponseOne } from 'src/app/shared/models/entidades/respuestas/responseOne.model';
import { Excel } from 'src/app/shared/models/entidades/excelEstado.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  apiUrl = environment.apiUrl;  
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getCantidad(page: number, size: number, idUsuario: number): Observable<ResponseData<Categoria>> {
    const url = `${this.apiUrl}categoria/getCantidad`;

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('idUsuario', idUsuario.toString());

    return this.http.get<ResponseData<Categoria>>(url, { params, headers: this.getHeaders() });
  }

  create(categoria: Categoria): Observable<ResponseOne<Categoria>> {
    return this.http.post<ResponseOne<Categoria>>(`${this.apiUrl}categoria`, categoria, { headers: this.getHeaders() });
  }

  getAll(idUsuario: number): Observable<ResponseData<Categoria>> {
    const url = `${this.apiUrl}categoria/getCategorias/${idUsuario}`;
    return this.http.get<ResponseData<Categoria>>(url, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<Categoria> {
    const url = `${this.apiUrl}categoria/${id}`;
    return this.http.get<Categoria>(url, { headers: this.getHeaders() });
  }

  update(categoria: Partial<Categoria>): Observable<Categoria> {
    const url = `${this.apiUrl}categoria/${categoria.Id}`;
    return this.http.put<Categoria>(url, categoria, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}categoria/${id}`;
    return this.http.delete<void>(url, { headers: this.getHeaders() });
  }

  exportExcel(res: Excel): Observable<any> {
    const url = `${this.apiUrl}categoria/exportExcel`;

    return this.http.post<Excel>(url, res);
  }
}
