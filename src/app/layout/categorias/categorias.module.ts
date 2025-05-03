import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { CategoriasRoutingModule } from './categorias.routing';
import { CategoriasListComponent } from './pages/categorias-list/categorias-list.component';
import { CategoriasListEffects } from './ngrx/effects/categorias-list.effects';
import { CategoriaService } from './service/categoria.service';
import { CategoriaDetailComponent } from './pages/categoria-detail/categoria-detail.component';
import { CategoriaDetailEffects } from './ngrx/effects/categoria-detail.effects';
import { PrimeNgModule } from 'src/app/primeng/primeng.module';
import { StoreModule } from '@ngrx/store';
import * as CategoriasListReducers from './ngrx/reducer/categorias-list.reducer';
import * as CategoriaDetailReducers from './ngrx/reducer/categoria-detail.reducer';

const CATEGORIAS_COMPONENTS = [
    CategoriasListComponent,
    CategoriaDetailComponent
];

const CATEGORIAS_EFFECTS = [
    CategoriasListEffects,
    CategoriaDetailEffects
];

const CATEGORIAS_PROVIDERS = [
    CategoriaService,
];

@NgModule({
    declarations: [
        ...CATEGORIAS_COMPONENTS,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        PrimeNgModule,
        CategoriasRoutingModule,
        StoreModule.forFeature(CategoriasListReducers.categoriasListFeatureKey, CategoriasListReducers.reducer),
        StoreModule.forFeature(CategoriaDetailReducers.categoriaDetailFeatureKey, CategoriaDetailReducers.reducer),
        EffectsModule.forFeature(CATEGORIAS_EFFECTS),
    ],
    providers: [
        ...CATEGORIAS_PROVIDERS
    ],
    exports: [
        CommonModule,
        ...CATEGORIAS_COMPONENTS,
    ]
})
export class CategoriasModule { }
