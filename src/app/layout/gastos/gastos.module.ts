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

const GASTOS_COMPONENTS = [
  GastosListComponent,
  GastoDetailComponent
];

const GASTOS_EFFECTS = [
  GastosListEffects,
  GastoDetailEffects
];

const GASTOS_PROVIDERS = [
  GastoService,
];

@NgModule({
  declarations: [
    ...GASTOS_COMPONENTS,    
  ],
  imports: [
    CommonModule,
    FormsModule,    
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    PrimeNgModule,
    GastosRoutingModule,
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
