import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CuentaDetailComponent } from './pages/cuenta-detail/cuenta-detail.component';
import { CuentasListComponent } from './pages/cuentas-list/cuentas-list.component';

const routes: Routes = [
  { path: 'cuentas-list', component: CuentasListComponent },
  { path: 'cuenta-detail/:id', component: CuentaDetailComponent },
  { path: '**', redirectTo: 'cuentas-list' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentasRoutingModule { }
