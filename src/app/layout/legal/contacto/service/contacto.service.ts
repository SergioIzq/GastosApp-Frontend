import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContactoFormRequest } from 'src/app/shared/models/entidades/requests/contactoFormRequest.model';

@Injectable({
  providedIn: 'root'
})
export class ContactoFormService {

  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  enviarContactoForm(formContacto: ContactoFormRequest): Observable<ContactoFormRequest> {    
    return this.http.post<ContactoFormRequest>(`${this.apiUrl}auth/contactoForm`, formContacto);
  }

}