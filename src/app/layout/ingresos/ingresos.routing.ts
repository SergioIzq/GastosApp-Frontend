import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IngresoDetailComponent } from './pages/ingreso-detail/ingreso-detail.component';
import { IngresosListComponent } from './pages/ingresos-list/ingresos-list.component';
import { IngresosProgramadosListComponent } from './pages/ingresos-programados-list/ingresos-programados-list.component';
import { IngresoProgramadoDetailComponent } from './pages/ingreso-programado-detail/ingreso-programado-detail.component';

const routes: Routes = [
    { path: 'ingresos-list', component: IngresosListComponent },
    { path: 'ingresos-programados-list', component: IngresosProgramadosListComponent },
    { path: 'ingreso-detail/:id', component: IngresoDetailComponent },
    { path: 'ingreso-programado-detail/:id', component: IngresoProgramadoDetailComponent },
    { path: '**', redirectTo: 'ingresos-list' },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IngresosRoutingModule { }
