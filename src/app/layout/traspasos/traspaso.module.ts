import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { TraspasoDetailComponent } from './pages/traspaso-detail/traspaso-detail.component';
import { TraspasoService } from './service/traspaso.service';
import { TraspasoDetailEffects } from './ngrx/effects/traspaso-detail.effects';
import { TraspasoRoutingModule } from './traspaso.routing';
import { PrimeNgModule } from 'src/app/primeng/primeng.module';
import { SharedModule } from 'src/app/shared/pipes/shared.module';
import { TraspasosListComponent } from './pages/traspasos-list/traspasos-list.component';
import { TraspasosListEffects } from './ngrx/effects/traspasos-list.effects';

const TRASPASO_COMPONENTS = [
    TraspasoDetailComponent,
    TraspasosListComponent
];

const TRASPASO_EFFECTS = [
    TraspasoDetailEffects,
    TraspasosListEffects
];

const TRASPASO_PROVIDERS = [
    TraspasoService,
];

@NgModule({
    declarations: [
        ...TRASPASO_COMPONENTS,                
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        PrimeNgModule,
        TraspasoRoutingModule,
        EffectsModule.forFeature(TRASPASO_EFFECTS),
    ],
    providers: [
        ...TRASPASO_PROVIDERS
    ],
    exports: [
        CommonModule,
        ...TRASPASO_COMPONENTS,
    ]
})
export class TraspasoModule { }
