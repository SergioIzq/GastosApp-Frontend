import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IngresoDetailComponent } from './pages/ingreso-detail/ingreso-detail.component';
import { IngresosListComponent } from './pages/ingresos-list/ingresos-list.component';

const routes: Routes = [
    { path: 'ingresos-list', component: IngresosListComponent },
    { path: 'ingreso-detail/:id', component: IngresoDetailComponent },
    { path: '**', redirectTo: 'ingresos-list' },  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IngresosRoutingModule { }
