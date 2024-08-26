import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonaDetailComponent } from './pages/persona-detail/persona-detail.component';
import { PersonasListComponent } from './pages/personas-list/personas-list.component';

const routes: Routes = [
  { path: 'personas-list', component: PersonasListComponent },
  { path: 'persona-detail/:id', component: PersonaDetailComponent },
  { path: '**', redirectTo: 'personas-list' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonasRoutingModule { }
