import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './shared/home/home-page.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { PoliticaPrivacidadComponent } from './layout/legal/politica-privacidad/politica-privacidad.component';
import { AvisoLegalComponent } from './layout/legal/aviso-legal/aviso-legal.component';
import { PoliticaCookiesComponent } from './layout/legal/politica-cookies/politica-cookies.component';
import { ContactoComponent } from './layout/legal/contacto/contacto.component';
import { AboutUsComponent } from './layout/legal/about-us/about-us.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  {
    path: 'ingresos',
    loadChildren: () => import('./layout/ingresos/ingresos.module').then(m => m.IngresosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'usuario',
    loadChildren: () => import('./layout/usuario/usuario.module').then(m => m.UsuariosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'gastos',
    loadChildren: () => import('./layout/gastos/gastos.module').then(m => m.GastosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'categorias',
    loadChildren: () => import('./layout/categorias/categorias.module').then(m => m.CategoriasModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'resumen',
    loadChildren: () => import('./layout/resumen/resumen.module').then(m => m.ResumenModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'conceptos',
    loadChildren: () => import('./layout/conceptos/conceptos.module').then(m => m.ConceptosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'personas',
    loadChildren: () => import('./layout/personas/personas.module').then(m => m.PersonasModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'clientes',
    loadChildren: () => import('./layout/clientes/clientes.module').then(m => m.ClientesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'proveedores',
    loadChildren: () => import('./layout/proveedores/proveedores.module').then(m => m.ProveedoresModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'cuentas',
    loadChildren: () => import('./layout/cuentas/cuentas.module').then(m => m.CuentasModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'traspasos',
    loadChildren: () => import('./layout/traspasos/traspaso.module').then(m => m.TraspasoModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'formas-pago',
    loadChildren: () => import('./layout/formas-pago/formas-pago.module').then(m => m.FormasPagoModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./shared/auth/auth.module').then(m => m.AuthModule),
  },
  { path: 'legal/politica-privacidad', component: PoliticaPrivacidadComponent },
  { path: 'legal/aviso-legal', component: AvisoLegalComponent },
  { path: 'legal/politica-cookies', component: PoliticaCookiesComponent },
  { path: 'legal/contacto', component: ContactoComponent },
  { path: 'legal/about-us', component: AboutUsComponent },
  { path: '**', component: NotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
