import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { PrimeNgModule } from 'src/app/primeng/primeng.module';
import { ExportarExcelComponent } from './pages/exportar-clientes-excel/exportar-excel.component';
import { ExportarExcelEffects } from './effects/exportar-excel.effects';
import { ExportarExcelService } from './service/exportarExcel.service';


const EXPORTAR_EXCEL_COMPONENTS = [
    ExportarExcelComponent
];

const EXPORTAR_EXCEL_EFFECTS = [
    ExportarExcelEffects
];

const EXPORTAR_EXCEL_PROVIDERS = [
    ExportarExcelService,
];

@NgModule({
    declarations: [
        ...EXPORTAR_EXCEL_COMPONENTS
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        PrimeNgModule,
        EffectsModule.forFeature(EXPORTAR_EXCEL_EFFECTS)
    ],
    providers: [
        ...EXPORTAR_EXCEL_PROVIDERS
    ],
    exports: [
        CommonModule,
        ...EXPORTAR_EXCEL_COMPONENTS,
    ]
})
export class ExportarExcelModule { }
