import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, ActionsSubject } from '@ngrx/store';
import { Subject, takeUntil, filter } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import * as AuthActions from '../../ngrx/auth.actions';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
})
export class ConfirmAccountComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private actions$: ActionsSubject,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.actions$
      .pipe(
        takeUntil(this.destroy$),
        filter((action) => action.type === '[Auth] Confirm Email Success')
      )
      .subscribe(() => {
        this.confirmationService.confirm({
          message: 'Tu cuenta ha sido activada correctamente.',
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

    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.store.dispatch(AuthActions.confirmEmail({ token }));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
