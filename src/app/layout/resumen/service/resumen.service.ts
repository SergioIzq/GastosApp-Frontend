import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resumen } from 'src/app/shared/models/entidades/resumen.model';
import { HttpParams } from '@angular/common/http';
import { ResumenIngresosResponse } from 'src/app/shared/models/entidades/resumenIngresosResponse.model';
import { ResumenGastosResponse } from 'src/app/shared/models/entidades/ResumenGastosResumen.model';
import { ResumenDatos } from 'src/app/shared/models/entidades/resumenDatos.model';

@Injectable({
  providedIn: 'root'
})
export class ResumenService {

  apiUrl = 'https://gastosapp-backend.onrender.com/api/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Resumen[]> {
    const url = `${this.apiUrl}resumen`;
    return this.http.get<Resumen[]>(url);
  }

  getCantidadIngresos(page: number, size: number, fechaInicio: Date | null, fechaFin: Date | null): Observable<ResumenIngresosResponse> {
    const url = `${this.apiUrl}resumen/getCantidadIngresos`;

    if (fechaInicio && fechaFin) {
      const params = new HttpParams()
        .set('page', page)
        .set('size', size)
        .set('periodoInicio', fechaInicio.toISOString())
        .set('periodoFin', fechaFin.toISOString());
      return this.http.get<ResumenIngresosResponse>(url, { params });
    } else {
      return this.http.get<ResumenIngresosResponse>(url, {});
    }

  }

  getCantidadGastos(page: number, size: number, fechaInicio: Date | null, fechaFin: Date | null): Observable<ResumenGastosResponse> {
    const url = `${this.apiUrl}resumen/getCantidadGastos`;

    if (fechaInicio && fechaFin) {
      const params = new HttpParams()
        .set('page', page)
        .set('size', size)
        .set('periodoInicio', fechaInicio.toISOString())
        .set('periodoFin', fechaFin.toISOString());
      return this.http.get<ResumenGastosResponse>(url, { params });
    } else {
      return this.http.get<ResumenGastosResponse>(url, {});
    }
  }

  exportExcel(datos: ResumenDatos, dirPath: string): Observable<any> {
    const url = `${this.apiUrl}resumen/exportExcel`;
    const body ={
      Datos: datos,
      dirPath: dirPath
    }
    return this.http.post<any>(url, body);
  }


}
