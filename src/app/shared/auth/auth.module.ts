import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth.routing';
import { PrimeNgModule } from 'src/app/primeng/primeng.module';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthService } from './service/auth.service';
import { ConfirmAccountComponent } from './pages/confirm-account/confirm-account.component';
import { RecuperarPwdComponent } from './pages/recuperar-pwd/recuperar-pwd.component';

const AUTH_COMPONENTS = [
    LoginComponent,
    RegisterComponent,
    ConfirmAccountComponent,
    RecuperarPwdComponent
];

const AUTH_PROVIDERS = [
    AuthService,
];

@NgModule({
    declarations: [
        ...AUTH_COMPONENTS,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        PrimeNgModule,
        AuthRoutingModule,
    ],
    providers: [
        ...AUTH_PROVIDERS
    ],
    exports: [
        CommonModule,
        ...AUTH_COMPONENTS,
    ]
})
export class AuthModule { }
