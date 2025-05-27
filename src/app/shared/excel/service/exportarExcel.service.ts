import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ExportarExcelOpciones } from '../exportar-excel-opciones.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ExportarExcelService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  exportExcel(url: string, opciones: ExportarExcelOpciones): Observable<Blob> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl + url}/exportar`, opciones, { headers, responseType: 'blob' });
  }

}
