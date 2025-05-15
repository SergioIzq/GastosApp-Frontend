import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../ngrx/auth.actions';

@Component({
  selector: 'app-confirm-account',
  template: `<p-toast></p-toast> <p>Procesando confirmación...</p>`,
})
export class ConfirmAccountComponent implements OnInit {
  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.store.dispatch(AuthActions.confirmEmail({ token }));
    }
  }
}
