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
import * as IngresosProgramadosListReducers from './ngrx/reducer/ingresos-programados-list.reducer';
import * as IngresoDetailReducers from './ngrx/reducer/ingreso-detail.reducer';
import * as IngresoProgramadoDetailReducers from './ngrx/reducer/ingreso-programado-detail.reducer';
import { StoreModule } from '@ngrx/store';
import { IngresosProgramadosListEffects } from './ngrx/effects/ingresos-programados-list.effects';
import { IngresosProgramadosListComponent } from './pages/ingresos-programados-list/ingresos-programados-list.component';
import { IngresoProgramadoDetailComponent } from './pages/ingreso-programado-detail/ingreso-programado-detail.component';
import { IngresoProgramadoDetailEffects } from './ngrx/effects/ingreso-programado-detail.effects';
import { ExportarExcelModule } from 'src/app/shared/excel/exportar-excel.module';

const INGRESOS_COMPONENTS = [
  IngresosListComponent,
  IngresoDetailComponent,
  IngresosProgramadosListComponent,
  IngresoProgramadoDetailComponent
];

const INGRESOS_EFFECTS = [
  IngresosListEffects,
  IngresoDetailEffects,
  IngresosProgramadosListEffects,
  IngresoProgramadoDetailEffects
];

const INGRESOS_PROVIDERS = [
  IngresoService
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
    ExportarExcelModule,
    StoreModule.forFeature(IngresosListReducers.ingresosListFeatureKey, IngresosListReducers.reducer),
    StoreModule.forFeature(IngresoDetailReducers.ingresoDetailFeatureKey, IngresoDetailReducers.reducer),
    StoreModule.forFeature(IngresosProgramadosListReducers.ingresosProgramadosListFeatureKey, IngresosProgramadosListReducers.reducer),
    StoreModule.forFeature(IngresoProgramadoDetailReducers.ingresoProgramadoDetailFeatureKey, IngresoProgramadoDetailReducers.reducer),
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
