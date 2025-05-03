import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { ClientesListComponent } from './pages/clientes-list/clientes-list.component';
import { ClientesListEffects } from './ngrx/effects/clientes-list.effects';
import { ClienteDetailComponent } from './pages/cliente-detail/cliente-detail.component';
import { ClienteService } from './service/clientes.service';
import { ClienteDetailEffects } from './ngrx/effects/cliente-detail.effects';
import { ClientesRoutingModule } from './clientes.routing';
import { PrimeNgModule } from 'src/app/primeng/primeng.module';
import * as ClientesListReducers from './ngrx/reducers/clientes-list.reducer';
import * as ClienteDetailReducers from './ngrx/reducers/cliente-detail.reducer';
import { StoreModule } from '@ngrx/store';

const CLIENTES_COMPONENTS = [
    ClientesListComponent,
    ClienteDetailComponent
];

const CLIENTES_EFFECTS = [
    ClientesListEffects,
    ClienteDetailEffects
];

const CLIENTES_PROVIDERS = [
    ClienteService,
];

@NgModule({
    declarations: [
        ...CLIENTES_COMPONENTS,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        PrimeNgModule,
        ClientesRoutingModule,
        StoreModule.forFeature(ClientesListReducers.clientesListFeatureKey, ClientesListReducers.reducer),
        StoreModule.forFeature(ClienteDetailReducers.clienteDetailFeaturekey, ClienteDetailReducers.reducer),
        EffectsModule.forFeature(CLIENTES_EFFECTS)
    ],
    providers: [
        ...CLIENTES_PROVIDERS
    ],
    exports: [
        CommonModule,
        ...CLIENTES_COMPONENTS,
    ]
})
export class ClientesModule { }
