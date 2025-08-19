import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { PrimeNgModule } from 'src/app/primeng/primeng.module';
import { ContactoComponent } from './contacto.component';
import { ContactoFormEffects } from './ngrx/contacto.effects';
import { ContactoFormService } from './service/contacto.service';
import { ContactoRoutingModule } from './gastos.routing';

const CONTACTO_COMPONENTS = [
    ContactoComponent
];

const CONTACTO_EFFECTS = [
    ContactoFormEffects
];

const CONTACTO_PROVIDERS = [
    ContactoFormService
];

@NgModule({
    declarations: [
        ...CONTACTO_COMPONENTS,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        PrimeNgModule,
        ContactoRoutingModule,
        EffectsModule.forFeature(CONTACTO_EFFECTS),
    ],
    providers: [
        ...CONTACTO_PROVIDERS
    ],
    exports: [
        CommonModule,
        ...CONTACTO_COMPONENTS,
    ]
})
export class ContactoFormModule { }
