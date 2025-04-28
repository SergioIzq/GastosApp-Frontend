import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { PersonasListComponent } from './pages/personas-list/personas-list.component';
import { PersonasListEffects } from './ngrx/effects/personas-list.effects';
import { PersonaDetailComponent } from './pages/persona-detail/persona-detail.component';
import { PersonaService } from './service/personas.service';
import { PersonaDetailEffects } from './ngrx/effects/persona-detail.effects';
import { PersonasRoutingModule } from './personas.routing';
import { PrimeNgModule } from 'src/app/primeng/primeng.module';
import * as PersonasListReducers from './ngrx/reducers/personas-list.reducer';
import * as PersonaDetailReducers from './ngrx/reducers/persona-detail.reducer';
import { StoreModule } from '@ngrx/store';

const PERSONAS_COMPONENTS = [
    PersonasListComponent,
    PersonaDetailComponent
];

const PERSONAS_EFFECTS = [
    PersonasListEffects,
    PersonaDetailEffects
];

const PERSONAS_PROVIDERS = [
    PersonaService,
];

@NgModule({
    declarations: [
        ...PERSONAS_COMPONENTS,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        PrimeNgModule,
        PersonasRoutingModule,
        StoreModule.forFeature(PersonasListReducers.personasListFeatureKey, PersonasListReducers.reducer),
        StoreModule.forFeature(PersonaDetailReducers.personaDetailFeatureKey, PersonaDetailReducers.reducer),
        EffectsModule.forFeature(PERSONAS_EFFECTS),
    ],
    providers: [
        ...PERSONAS_PROVIDERS
    ],
    exports: [
        CommonModule,
        ...PERSONAS_COMPONENTS,
    ]
})
export class PersonasModule { }
