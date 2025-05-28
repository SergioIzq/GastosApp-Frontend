import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { ConceptosListComponent } from './pages/conceptos-list/conceptos-list.component';
import { ConceptosListEffects } from './ngrx/effects/conceptos-list.effects';
import { ConceptoDetailComponent } from './pages/concepto-detail/concepto-detail.component';
import { ConceptoService } from './service/concepto.service';
import { ConceptoDetailEffects } from './ngrx/effects/concepto-detail.effects';
import { ConceptosRoutingModule } from './conceptos.routing';
import { PrimeNgModule } from 'src/app/primeng/primeng.module';
import * as ConceptoDetailReducers from './ngrx/reducers/concepto-detail.reducer';
import * as ConceptosListReducers from './ngrx/reducers/conceptos-list.reducer';
import { StoreModule } from '@ngrx/store';
import { ExportarExcelModule } from 'src/app/shared/excel/exportar-excel.module';

const CONCEPTOS_COMPONENTS = [
    ConceptosListComponent,
    ConceptoDetailComponent
];

const CONCEPTOS_EFFECTS = [
    ConceptosListEffects,
    ConceptoDetailEffects
];

const CONCEPTOS_PROVIDERS = [
    ConceptoService,
];

@NgModule({
    declarations: [
        ...CONCEPTOS_COMPONENTS,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        PrimeNgModule,
        ConceptosRoutingModule,
        ExportarExcelModule,
        StoreModule.forFeature(ConceptoDetailReducers.conceptoDetailFeatureKey, ConceptoDetailReducers.reducer),
        StoreModule.forFeature(ConceptosListReducers.conceptosListFeatureKey, ConceptosListReducers.reducer),
        EffectsModule.forFeature(CONCEPTOS_EFFECTS),
    ],
    providers: [
        ...CONCEPTOS_PROVIDERS
    ],
    exports: [
        CommonModule,
        ...CONCEPTOS_COMPONENTS,
    ]
})
export class ConceptosModule { }
