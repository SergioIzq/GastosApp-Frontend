import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteDetailComponent } from './pages/cliente-detail/cliente-detail.component';
import { ClientesListComponent } from './pages/clientes-list/clientes-list.component';

const routes: Routes = [
  { path: 'clientes-list', component: ClientesListComponent },
  { path: 'cliente-detail/:id', component: ClienteDetailComponent },
  { path: '**', redirectTo: 'clientes-list' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
