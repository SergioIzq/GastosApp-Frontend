import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { GastosListComponent } from './pages/gastos-list/gastos-list.component';
import { GastosListEffects } from './ngrx/effects/gastos-list.effects';
import { GastoDetailEffects } from './ngrx/effects/gasto-detail.effects';
import { GastoService } from './service/gasto.service';
import { GastosRoutingModule } from './gastos.routing';
import { GastoDetailComponent } from './pages/gasto-detail/gasto-detail.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PrimeNgModule } from 'src/app/primeng/primeng.module';
import { SharedModule } from 'src/app/shared/pipes/shared.module';
import { GastoProgramadoDetailComponent } from './pages/gasto-programado-detail/gasto-programado-detail.component';
import { GastosProgramadosListComponent } from './pages/gastos-programados-list/gastos-programados-list.component';
import { GastosProgramadosListEffects } from './ngrx/effects/gastos-programados-list.effects';
import { StoreModule } from '@ngrx/store';
import * as GastoDetailReducer from './ngrx/reducer/gasto-detail.reducer'
import * as GastosListReducer from './ngrx/reducer/gastos-list.reducer'
import * as GastosProgramadosListReducer from './ngrx/reducer/gastos-programados-list.reducer'
import * as GastoProgramadoDetailReducer from './ngrx/reducer/gasto-programado-detail.reducer'
import { GastoProgramadoDetailEffects } from './ngrx/effects/gasto-programado-detail.effects';


const GASTOS_COMPONENTS = [
  GastosListComponent,
  GastoDetailComponent,
  GastosProgramadosListComponent,
  GastoProgramadoDetailComponent
];

const GASTOS_EFFECTS = [
  GastosListEffects,
  GastosProgramadosListEffects,
  GastoDetailEffects,
  GastoProgramadoDetailEffects
];

const GASTOS_PROVIDERS = [
  GastoService,
];

@NgModule({
  declarations: [
    ...GASTOS_COMPONENTS     
  ],
  imports: [
    CommonModule,
    FormsModule,    
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    PrimeNgModule,
    GastosRoutingModule,
    StoreModule.forFeature(GastosListReducer.gastosListFeatureKey, GastosListReducer.reducer),
    StoreModule.forFeature(GastoDetailReducer.gastoDetailFeatureKey, GastoDetailReducer.reducer),
    StoreModule.forFeature(GastosProgramadosListReducer.gastosProgramadosListFeatureKey, GastosProgramadosListReducer.reducer),
    StoreModule.forFeature(GastoProgramadoDetailReducer.gastoProgramadoDetailFeatureKey, GastoProgramadoDetailReducer.reducer),
    EffectsModule.forFeature(GASTOS_EFFECTS),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    ...GASTOS_PROVIDERS
  ],
  exports: [
    CommonModule,
    ...GASTOS_COMPONENTS,
  ]
})
export class GastosModule { }
