import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProveedorDetailComponent } from './pages/proveedor-detail/proveedor-detail.component';
import { ProveedoresListComponent } from './pages/proveedores-list/proveedores-list.component';

const routes: Routes = [
  { path: 'proveedores-list', component: ProveedoresListComponent },
  { path: 'proveedor-detail/:id', component: ProveedorDetailComponent },
  { path: '**', redirectTo: 'proveedores-list' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedoresRoutingModule { }
