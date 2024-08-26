import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormaPagoDetailComponent } from './pages/forma-pago-detail/forma-pago-detail.component';
import { FormasPagoListComponent } from './pages/formas-pago-list/formas-pago-list.component';

const routes: Routes = [
  { path: 'formas-pago-list', component: FormasPagoListComponent },
  { path: 'forma-pago-detail/:id', component: FormaPagoDetailComponent },
  { path: '**', redirectTo: 'formas-pago-list' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormasPagoRoutingModule { }
