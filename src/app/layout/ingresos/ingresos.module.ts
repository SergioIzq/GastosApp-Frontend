import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { IngresosListComponent } from './pages/ingresos-list/ingresos-list.component';
import { IngresosListEffects } from './ngrx/effects/ingresos-list.effects';
import { IngresoDetailEffects } from './ngrx/effects/ingreso-detail.effects';
import { IngresoService } from './service/ingreso.service';
import { IngresosRoutingModule } from './ingresos.routing';
import { IngresoDetailComponent } from './pages/ingreso-detail/ingreso-detail.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PrimeNgModule } from 'src/app/primeng/primeng.module';
import { SharedModule } from 'src/app/shared/pipes/shared.module';
import * as IngresosListReducers from './ngrx/reducer/ingresos-list.reducer';
import * as IngresoDetailReducers from './ngrx/reducer/ingreso-detail.reducer';
import { StoreModule } from '@ngrx/store';

const INGRESOS_COMPONENTS = [
  IngresosListComponent,
  IngresoDetailComponent
];

const INGRESOS_EFFECTS = [
  IngresosListEffects,
  IngresoDetailEffects
];

const INGRESOS_PROVIDERS = [
  IngresoService,
];

@NgModule({
  declarations: [
    ...INGRESOS_COMPONENTS,    
  ],
  imports: [
    CommonModule,
    FormsModule,    
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    PrimeNgModule,
    IngresosRoutingModule,
    StoreModule.forFeature(IngresosListReducers.ingresosListFeatureKey, IngresosListReducers.reducer),
    StoreModule.forFeature(IngresoDetailReducers.ingresoDetailFeatureKey, IngresoDetailReducers.reducer),
    EffectsModule.forFeature(INGRESOS_EFFECTS),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    ...INGRESOS_PROVIDERS
  ],
  exports: [
    CommonModule,
    ...INGRESOS_COMPONENTS,
  ]
})
export class IngresosModule { }
