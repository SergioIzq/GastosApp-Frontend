import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriasListComponent } from './pages/categorias-list/categorias-list.component';
import { CategoriaDetailComponent } from './pages/categoria-detail/categoria-detail.component';

const routes: Routes = [
    { path: 'categorias-list', component: CategoriasListComponent },
    { path: 'categoria-detail/:id', component: CategoriaDetailComponent },
    { path: '**', redirectTo: 'categorias-list' },  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategoriasRoutingModule { }
