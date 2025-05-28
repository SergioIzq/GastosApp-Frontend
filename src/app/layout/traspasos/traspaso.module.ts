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
import * as TraspasosListReducers from './ngrx/reducer/traspasos-list.reducer';
import * as TraspasosProgramadosListReducers from './ngrx/reducer/traspasos-programados-list.reducer';
import * as TraspasoProgramadoDetailReducers from './ngrx/reducer/traspaso-programado-detail.reducer';
import * as TraspasoDetailReducers from './ngrx/reducer/traspaso-detail.reducer';
import { StoreModule } from '@ngrx/store';
import { TraspasosProgramadosListComponent } from './pages/traspasos-programados-list/traspasos-programados-list.component';
import { TraspasosProgramadosListEffects } from './ngrx/effects/traspasos-programados-list.effects';
import { TraspasoProgramadoDetailComponent } from './pages/traspaso-programado-detail/traspaso-programado-detail.component';
import { TraspasoProgramadoDetailEffects } from './ngrx/effects/traspaso-programado-detail.effects';
import { ExportarExcelModule } from 'src/app/shared/excel/exportar-excel.module';

const TRASPASO_COMPONENTS = [
    TraspasoDetailComponent,
    TraspasosListComponent,
    TraspasosProgramadosListComponent,
    TraspasoProgramadoDetailComponent
];

const TRASPASO_EFFECTS = [
    TraspasoDetailEffects,
    TraspasosListEffects,
    TraspasosProgramadosListEffects,
    TraspasoProgramadoDetailEffects
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
        ExportarExcelModule,
        StoreModule.forFeature(TraspasosListReducers.traspasosListFeatureKey, TraspasosListReducers.reducer),
        StoreModule.forFeature(TraspasoDetailReducers.traspasoDetailFeatureKey, TraspasoDetailReducers.reducer),
        StoreModule.forFeature(TraspasosProgramadosListReducers.traspasosProgramadosListFeatureKey, TraspasosProgramadosListReducers.reducer),
        StoreModule.forFeature(TraspasoProgramadoDetailReducers.traspasoProgramadoDetailFeatureKey, TraspasoProgramadoDetailReducers.reducer),
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
