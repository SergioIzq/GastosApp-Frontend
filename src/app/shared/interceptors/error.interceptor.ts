import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api'; // O el servicio que uses para mostrar mensajes
import { Router } from '@angular/router'; // Para redirigir al usuario
import { AppState } from 'src/app/app.state';
import { Store } from '@ngrx/store';
import { logout } from '../auth/ngrx/auth.actions';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private messageService: MessageService,
        private router: Router,
        private store: Store<AppState>
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {

                if (error.status === 0 && error.error instanceof ProgressEvent && error.error.type === 'timeout') {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Timeout',
                        detail: 'La solicitud ha tardado demasiado en responder. Por favor, inténtelo de nuevo más tarde.',
                        life: 8000
                    });

                } else if (error.status === 401) {

                    const errorMessage = error.error?.message?.toLowerCase();

                    if (errorMessage?.includes('Sesión expirada')) {
                        this.store.dispatch(logout());
                        this.router.navigate(['/home']);
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Sesión expirada',
                            detail: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
                            life: 8000
                        });
                    } else {
                        error.error.Errors.forEach((errorMsg: string) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: error.error.Message,
                                detail: errorMsg,
                                life: 8000
                            });
                        });
                    }
                } else if (error.error && error.error.Errors) {
                    // Manejo de otros errores
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

                return throwError(() => new Error(error.message));
            })
        );
    }
}
