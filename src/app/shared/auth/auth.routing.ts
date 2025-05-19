import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ConfirmAccountComponent } from './pages/confirm-account/confirm-account.component';
import { RecuperarPwdComponent } from './pages/recuperar-pwd/recuperar-pwd.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirmar-correo', component: ConfirmAccountComponent },
  { path: 'confirmar-nueva-pwd', component: RecuperarPwdComponent },
  { path: '**', redirectTo: 'register' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
