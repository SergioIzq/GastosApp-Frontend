import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioDetailComponent } from './usuario-detail/usuario-detail.component';

const routes: Routes = [
  { path: 'usuario-detail', component: UsuarioDetailComponent },
  { path: '**', redirectTo: 'usuario-detail' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
