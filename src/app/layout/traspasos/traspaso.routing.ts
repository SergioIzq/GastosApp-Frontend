import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TraspasoDetailComponent } from './pages/traspaso-detail/traspaso-detail.component';
import { TraspasosListComponent } from './pages/traspasos-list/traspasos-list.component';
import { TraspasosProgramadosListComponent } from './pages/traspasos-programados-list/traspasos-programados-list.component';
import { TraspasoProgramadoDetailComponent } from './pages/traspaso-programado-detail/traspaso-programado-detail.component';

const routes: Routes = [
  { path: 'traspasos-list', component: TraspasosListComponent },
  { path: 'traspaso-detail/:id', component: TraspasoDetailComponent },
  { path: 'traspasos-programados-list', component: TraspasosProgramadosListComponent },
  { path: 'traspaso-programado-detail/:id', component: TraspasoProgramadoDetailComponent },
  { path: '**', redirectTo: 'traspasos-list' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TraspasoRoutingModule { }
