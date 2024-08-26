import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GastoDetailComponent } from './pages/gasto-detail/gasto-detail.component';
import { GastosListComponent } from './pages/gastos-list/gastos-list.component';

const routes: Routes = [
    { path: 'gastos-list', component: GastosListComponent },
    { path: 'gasto-detail/:id', component: GastoDetailComponent },
    { path: '**', redirectTo: 'gastos-list' },  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GastosRoutingModule { }
