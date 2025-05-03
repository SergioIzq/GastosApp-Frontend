import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth.routing';
import { PrimeNgModule } from 'src/app/primeng/primeng.module';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthService } from './service/auth.service';

const AUTH_COMPONENTS = [
    LoginComponent,
    RegisterComponent

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
