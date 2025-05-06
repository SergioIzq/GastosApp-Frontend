import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(protected http: HttpClient, protected messageService: MessageService) {}    

  protected handleSuccess(message: string): void {
    this.messageService.add({severity: 'success', summary: 'Operación exitosa', detail: message});
  }

  protected handleWarning(message: string): void {
    this.messageService.add({severity: 'warn', summary: 'Warning', detail: message});
  }
}
