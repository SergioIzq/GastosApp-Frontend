import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConceptoDetailComponent } from './pages/concepto-detail/concepto-detail.component';
import { ConceptosListComponent } from './pages/conceptos-list/conceptos-list.component';

const routes: Routes = [
  { path: 'conceptos-list', component: ConceptosListComponent },
  { path: 'concepto-detail/:id', component: ConceptoDetailComponent },
  { path: '**', redirectTo: 'conceptos-list' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConceptosRoutingModule { }
