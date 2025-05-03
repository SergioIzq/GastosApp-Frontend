import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { ResumenListComponent } from './pages/resumen-list/resumen-list.component';
import { ResumenListEffects } from './ngrx/effects/resumen-list.effects';
import { ResumenService } from './service/resumen.service';
import { ResumenRoutingModule } from './resumen.routing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PrimeNgModule } from 'src/app/primeng/primeng.module';
import { LOCALE_ID } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { resumenListFeatureKey, resumenListReducer } from './ngrx/reducers/resumen-list.reducer';

const RESUMEN_COMPONENTS = [
  ResumenListComponent,
];

const RESUMEN_EFFECTS = [
  ResumenListEffects,
];

const RESUMEN_PROVIDERS = [
  ResumenService,
];

@NgModule({
  declarations: [
    ...RESUMEN_COMPONENTS,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PrimeNgModule,
    ResumenRoutingModule,
    StoreModule.forFeature(resumenListFeatureKey, resumenListReducer),
    EffectsModule.forFeature(RESUMEN_EFFECTS)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    ...RESUMEN_PROVIDERS,
    { provide: LOCALE_ID, useValue: 'es-ES' },
  ],
  exports: [
    CommonModule,
    ...RESUMEN_COMPONENTS,
  ]
})
export class ResumenModule { }
