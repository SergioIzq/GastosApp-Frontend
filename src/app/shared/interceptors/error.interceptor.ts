import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api'; // O el servicio que uses para mostrar mensajes

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private messageService: MessageService) { }

    intercept(req: any, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.error && error.error.Errors) {
                    error.error.Errors.forEach((errorMsg: string) => {                        
                        this.messageService.add({
                            severity: 'error',
                            summary: error.error.Message,
                            detail: errorMsg,
                            life: 8000
                        });
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message || 'Error desconocido',
                        life: 8000
                    });
                }
                return throwError(error);
            })
            
        );
    }
}
