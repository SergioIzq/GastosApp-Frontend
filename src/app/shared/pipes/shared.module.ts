import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberFormatterDirective } from './numberFormatterDirective.directive';
import { NumberFormatterPipe } from './numberFormatterPipe.pipe';

@NgModule({
  declarations: [
    NumberFormatterDirective,
    NumberFormatterPipe // Asegúrate de que esté aquí
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NumberFormatterDirective, // Exporta la directiva para usarla en otros módulos
    NumberFormatterPipe       // Exporta la pipe para usarla en otros módulos
  ]
})
export class SharedModule { }
