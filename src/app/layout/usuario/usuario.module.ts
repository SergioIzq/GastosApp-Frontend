import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { UsuarioDetailComponent } from './usuario-detail/usuario-detail.component';
import { UsuarioService } from './service/usuario.service';
import { UsuarioDetailEffects } from './ngrx/usuario-detail.effects';
import { UsuarioRoutingModule } from './usuario.routing';
import { PrimeNgModule } from 'src/app/primeng/primeng.module';
import { SharedModule } from 'src/app/shared/pipes/shared.module';


const USUARIOS_COMPONENTS = [
    UsuarioDetailComponent
];

const USUARIOS_EFFECTS = [
    UsuarioDetailEffects
];

const USUARIOS_PROVIDERS = [
    UsuarioService,
];

@NgModule({
    declarations: [
        ...USUARIOS_COMPONENTS,
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        PrimeNgModule,
        UsuarioRoutingModule,
        EffectsModule.forFeature(USUARIOS_EFFECTS),
    ],
    providers: [
        ...USUARIOS_PROVIDERS,
    ],
    exports: [
        CommonModule,
        ...USUARIOS_COMPONENTS,
    ]
})
export class UsuariosModule { }
