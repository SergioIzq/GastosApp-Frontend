import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GastoDetailComponent } from './pages/gasto-detail/gasto-detail.component';
import { GastosListComponent } from './pages/gastos-list/gastos-list.component';
import { GastosProgramadosListComponent } from './pages/gastos-programados-list/gastos-programados-list.component';
import { GastoProgramadoDetailComponent } from './pages/gasto-programado-detail/gasto-programado-detail.component';

const routes: Routes = [
    { path: 'gastos-list', component: GastosListComponent },
    { path: 'gastos-programados-list', component: GastosProgramadosListComponent },
    { path: 'gasto-detail/:id', component: GastoDetailComponent },
    { path: 'gasto-programado-detail/:id', component: GastoProgramadoDetailComponent },
    { path: '**', redirectTo: 'gastos-list' },  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GastosRoutingModule { }
