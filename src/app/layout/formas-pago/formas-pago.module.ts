import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { FormasPagoListComponent } from './pages/formas-pago-list/formas-pago-list.component';
import { FormasPagoListEffects } from './ngrx/effects/formas-pago-list.effects';
import { FormaPagoDetailComponent } from './pages/forma-pago-detail/forma-pago-detail.component';
import { FormasPagoService } from './service/formas-pago.service';
import { FormaPagoDetailEffects } from './ngrx/effects/forma-pago-detail.effects';
import { FormasPagoRoutingModule } from './formas-pago.routing';
import { PrimeNgModule } from 'src/app/primeng/primeng.module';


const FORMAS_PAGO_COMPONENTS = [
    FormasPagoListComponent,
    FormaPagoDetailComponent
];

const FORMAS_PAGO_EFFECTS = [
    FormasPagoListEffects,
    FormaPagoDetailEffects
];

const FORMAS_PAGO_PROVIDERS = [
    FormasPagoService,
];

@NgModule({
    declarations: [
        ...FORMAS_PAGO_COMPONENTS,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        PrimeNgModule,
        FormasPagoRoutingModule,
        EffectsModule.forFeature(FORMAS_PAGO_EFFECTS),
    ],
    providers: [
        ...FORMAS_PAGO_PROVIDERS
    ],
    exports: [
        CommonModule,
        ...FORMAS_PAGO_COMPONENTS,
    ]
})
export class FormasPagoModule { }
