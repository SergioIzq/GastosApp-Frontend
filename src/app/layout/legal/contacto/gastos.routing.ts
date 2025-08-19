import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactoComponent } from './contacto.component';

const routes: Routes = [
    { path: 'contacto', component: ContactoComponent },
    { path: '**', redirectTo: 'contacto' },  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContactoRoutingModule { }
