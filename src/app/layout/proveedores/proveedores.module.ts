import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { ProveedoresListComponent } from './pages/proveedores-list/proveedores-list.component';
import { ProveedoresListEffects } from './ngrx/effects/proveedores-list.effects';
import { ProveedorDetailComponent } from './pages/proveedor-detail/proveedor-detail.component';
import { ProveedorService } from './service/proveedores.service';
import { ProveedorDetailEffects } from './ngrx/effects/proveedor-detail.effects';
import { ProveedoresRoutingModule } from './proveedores.routing';
import { PrimeNgModule } from 'src/app/primeng/primeng.module';
import * as ProveedoresListReducers from './ngrx/reducers/proveedores-list.reducer';
import * as ProveedorDetailReducers from './ngrx/reducers/proveedor-detail.reducer';
import { StoreModule } from '@ngrx/store';

const PROVEEDORES_COMPONENTS = [
    ProveedoresListComponent,
    ProveedorDetailComponent
];

const PROVEEDORES_EFFECTS = [
    ProveedoresListEffects,
    ProveedorDetailEffects
];

const PROVEEDORES_PROVIDERS = [
    ProveedorService,
];

@NgModule({
    declarations: [
        ...PROVEEDORES_COMPONENTS,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        PrimeNgModule,
        ProveedoresRoutingModule,
        StoreModule.forFeature(ProveedoresListReducers.proveedoresListFeatureKey, ProveedoresListReducers.reducer),
        StoreModule.forFeature(ProveedorDetailReducers.proveedorFeatureKey, ProveedorDetailReducers.reducer),
        EffectsModule.forFeature(PROVEEDORES_EFFECTS),
    ],
    providers: [
        ...PROVEEDORES_PROVIDERS
    ],
    exports: [
        CommonModule,
        ...PROVEEDORES_COMPONENTS,
    ]
})
export class ProveedoresModule { }
