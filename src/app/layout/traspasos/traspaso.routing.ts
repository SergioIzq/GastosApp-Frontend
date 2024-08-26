import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TraspasoDetailComponent } from './pages/traspaso-detail/traspaso-detail.component';
import { TraspasosListComponent } from './pages/traspasos-list/traspasos-list.component';

const routes: Routes = [  
  { path: 'traspasos-list', component: TraspasosListComponent },
  { path: 'traspaso-detail/:id', component: TraspasoDetailComponent },
  { path: '**', redirectTo: 'traspasos-list' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TraspasoRoutingModule { }
