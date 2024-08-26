import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResumenListComponent } from './pages/resumen-list/resumen-list.component';

const routes: Routes = [
    { path: 'resumen-list', component: ResumenListComponent },
    { path: '**', redirectTo: 'resumen-list' },  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResumenRoutingModule { }
