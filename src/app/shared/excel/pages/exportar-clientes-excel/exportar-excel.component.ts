import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ExportarExcelOpciones } from 'src/app/shared/excel/exportar-excel-opciones.interface';

@Component({
  selector: 'app-exportar-excel',
  templateUrl: './exportar-excel.component.html'
})
export class ExportarExcelComponent {
  visible: boolean = false;
  @Input() columnasDisponibles: { label: string; value: string }[] = [];
  @Input() tamano: number = 10;
  @Input() pagina: number = 1;

  @Output() exportar = new EventEmitter<ExportarExcelOpciones>();

  opciones: ExportarExcelOpciones = {
    nombreArchivo: '',
    origen: 'tabla',
    columnas: [],
    tamano: 10,
    pagina: 1
  };

  addBlur() {
    document.body.classList.add('blur-background');
  }

  cerrar() {
    this.visible = false;
    document.body.classList.remove('blur-background');
  }

  confirmar() {
    const opcionesActualizadas: ExportarExcelOpciones = {
      ...this.opciones,  // copia todo lo que ya tiene
      tamano: this.tamano,
      pagina: this.pagina
    };

    this.exportar.emit(opcionesActualizadas);
    this.cerrar();
  }

}