import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, ActionsSubject } from '@ngrx/store';
import { Subject, takeUntil, filter } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as AuthActions from '../../ngrx/auth.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordRequest } from 'src/app/shared/models/entidades/requests/passwordRequest.model';

@Component({
  selector: 'app-recuperar-pwd',
  styleUrls: ['./recuperar-pwd.component.css'],
  templateUrl: './recuperar-pwd.component.html',
})
export class RecuperarPwdComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  mostrarDialogo: boolean = true;
  contrasenaForm!: FormGroup;
  token!: string | null;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store,
    private actions$: ActionsSubject,
    private confirmationService: ConfirmationService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.contrasenaForm = this.fb.group({
      Contrasena: ['', [Validators.required]],
    });

    this.actions$
      .pipe(
        takeUntil(this.destroy$),
        filter((action) => action.type === 'confirmarNuevaPwdSuccess')
      )
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Operación exitosa',
          detail: 'Contraseña restablecida correctamente.',
          life: 5000
        });

        this.confirmationService.confirm({
          message: 'Tu contraseña ha sido restablecida correctamente.',
          header: 'Confirmación',
          icon: 'pi pi-info-circle',
          acceptLabel: 'Redirigir',
          acceptButtonStyleClass: 'p-button-success',
          closeOnEscape: false,
          dismissableMask: false,
          accept: () => {
            this.router.navigate(['/home']);
          },
        });
      });

    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  enviarContrasena() {
    if (this.contrasenaForm.valid) {
      let passwordRequest = new PasswordRequest();

      passwordRequest.Password = this.contrasenaForm.value.Contrasena;
      passwordRequest.Token = this.token!;
      
      this.store.dispatch(AuthActions.confirmarNuevaPwd({ passwordRequest }));

      this.mostrarDialogo = false;
    }
  }
}
