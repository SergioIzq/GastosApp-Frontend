import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { CuentasListComponent } from './pages/cuentas-list/cuentas-list.component';
import { CuentasListEffects } from './ngrx/effects/cuentas-list.effects';
import { CuentaDetailComponent } from './pages/cuenta-detail/cuenta-detail.component';
import { CuentaService } from './service/cuentas.service';
import { CuentaDetailEffects } from './ngrx/effects/cuenta-detail.effects';
import { CuentasRoutingModule } from './cuentas.routing';
import { PrimeNgModule } from 'src/app/primeng/primeng.module';
import { SharedModule } from 'src/app/shared/pipes/shared.module';
import { NumberFormatterPipe } from 'src/app/shared/pipes/numberFormatterPipe.pipe';


const CUENTAS_COMPONENTS = [
    CuentasListComponent,
    CuentaDetailComponent
];

const CUENTAS_EFFECTS = [
    CuentasListEffects,
    CuentaDetailEffects
];

const CUENTAS_PROVIDERS = [
    CuentaService,
];

@NgModule({
    declarations: [
        ...CUENTAS_COMPONENTS,
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        PrimeNgModule,
        CuentasRoutingModule,
        EffectsModule.forFeature(CUENTAS_EFFECTS),
    ],
    providers: [
        ...CUENTAS_PROVIDERS,
        NumberFormatterPipe
    ],
    exports: [
        CommonModule,
        ...CUENTAS_COMPONENTS,
    ]
})
export class CuentasModule { }
